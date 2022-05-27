import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GrpcService } from './grpc.service';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../../schemas/order.schema';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../../../schemas/cart.schema';
import { ObjectId } from 'mongodb';
import { CartAddDto } from '../dto/cart-add.dto';
import { plainToInstance } from 'class-transformer';
import { CartResponseDto } from '../dto/cart-response.dto';
import { RemoveItemDto } from '../dto/remove-item.dto';
import { PageDto } from '../../../dto/page.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

@Injectable()
export class OrderService {
  @Inject() private readonly grpcService: GrpcService;
  @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>;
  @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>;

  async addItemToCart(payload: CartAddDto, user) {
    const cart = await this.findOrCreateCart(
      new ObjectId(payload.cartId),
      new ObjectId(user._id),
    );
    const productsData = await this.getProductData(payload.items);
    cart.items = [...cart.items, ...productsData];
    cart.total = cart.items.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity;
    }, 0);
    cart.save();
    return plainToInstance(CartResponseDto, cart);
  }

  async removeItemFromCart(payload: RemoveItemDto, user) {
    const cart = await this.cartModel.findOne({
      _id: new ObjectId(payload.cartId),
      userId: new ObjectId(user._id),
      status: 'open',
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== payload.itemId,
    );
    cart.total = cart.items.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity;
    }, 0);
    await cart.save();
    return plainToInstance(CartResponseDto, cart);
  }

  async fetchCart(_id: string, userId: string) {
    const cart = await this.cartModel.findOne({
      _id: OrderService.castToObjectId(_id),
      userId: OrderService.castToObjectId(userId),
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return plainToInstance(CartResponseDto, cart);
  }

  async listUserCarts(query: PageDto, user) {
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 10;
    const carts = await this.cartModel
      .find({ userId: new ObjectId(user._id) })
      .skip(skip)
      .limit(limit);
    return plainToInstance(CartResponseDto, carts);
  }

  async listCartsAdmin(query: PageDto) {
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 10;
    const carts = this.cartModel
      .find({
        status: 'open',
      })
      .skip(skip)
      .limit(limit);
    return plainToInstance(CartResponseDto, carts);
  }

  async fetchCartAdmin(_id: string) {
    const cart = await this.cartModel.findOne({
      _id: OrderService.castToObjectId(_id),
    });
    if (!cart) {
      throw new NotFoundException('cart not fount');
    }
    return plainToInstance(CartResponseDto, cart);
  }

  async checkout(
    cartId: string | ObjectId,
    userId: string | ObjectId,
    payload: OrderCreateDto,
  ) {
    cartId = OrderService.castToObjectId(cartId);
    userId = OrderService.castToObjectId(userId);
    const cart = await this.cartModel.findOne({
      _id: cartId,
      userId: userId,
      status: 'open',
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const order = await this.orderModel.create({
      ...payload,
      userId: userId,
      cart: cart,
    });
    await Promise.all(
      cart.items.map(async (item) =>
        this.grpcService.reduceOrder(item._id.toString(), item.quantity),
      ),
    );
    cart.status = 'closed';
    await cart.save();
    await order.populate({ path: 'cart', model: this.cartModel });
    return plainToInstance(OrderResponseDto, order);
  }

  private async getProductData(products: { _id: string; quantity: number }[]) {
    return await Promise.all(
      products.map(async (product) => {
        try {
          const productData = await this.grpcService.getProduct(product._id);
          return {
            ...productData,
            quantity: product.quantity,
            _id: new ObjectId(productData._id),
          };
        } catch {
          throw new NotFoundException('invalid products');
        }
      }),
    );
  }

  private async findOrCreateCart(_id: ObjectId, userId: ObjectId) {
    if (_id) {
      const cart = await this.cartModel.findOne({
        _id,
        userId,
      });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      if (cart.status !== 'open') {
        throw new BadRequestException("Can't add items to the cart");
      }
      return cart;
    }
    return await this.cartModel.create({
      _id,
      userId,
      items: [],
      total: 0,
      status: 'open',
    });
  }

  private static castToObjectId(id: string | ObjectId) {
    try {
      return new ObjectId(id);
    } catch {
      throw new BadRequestException('invalid ID');
    }
  }
}
