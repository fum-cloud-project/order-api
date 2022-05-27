import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { OrderService } from './services/order.service';
import { CartAddDto } from './dto/cart-add.dto';
import { RemoveItemDto } from './dto/remove-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { PageDto } from '../../dto/page.dto';
import { OrderCreateDto } from './dto/order-create.dto';

@Controller()
@ApiSecurity('JWT auth')
@ApiTags('order')
@UseGuards(AuthGuard)
export class OrderController {
  @Inject() private readonly orderService: OrderService;

  @Post('cart/addItem')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ type: CartResponseDto, isArray: true })
  async addItem(@Body() payload: CartAddDto, @Req() req) {
    return this.orderService.addItemToCart(payload, req.user);
  }

  @Post('cart/removeItem')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ type: CartResponseDto, isArray: true })
  async removeItem(@Req() req, @Body() body: RemoveItemDto) {
    return this.orderService.removeItemFromCart(body, req.user);
  }

  @Get('cart/:id')
  @ApiResponse({ type: CartResponseDto })
  @ApiOperation({ summary: 'Get cart by id' })
  async getCart(@Param('id') id: string, @Req() req) {
    return this.orderService.fetchCart(id, req.user?._id);
  }

  @Get('cart')
  @ApiOperation({ summary: "Get user's carts" })
  @ApiResponse({ type: CartResponseDto, isArray: true })
  async getCarts(@Query() query: PageDto, @Req() req) {
    return this.orderService.listUserCarts(query, req.user?._id);
  }

  @Get('admin/carts')
  @ApiOperation({ summary: 'List all carts' })
  @ApiResponse({ type: CartResponseDto, isArray: true })
  async getCartsAdmin(@Query() query: PageDto) {
    return this.orderService.listCartsAdmin(query);
  }

  @Get('cart/:id')
  @ApiResponse({ type: CartResponseDto })
  @ApiOperation({ summary: 'Get cart by id(for admin)' })
  async getCartAdmin(@Param('id') id: string) {
    return this.orderService.fetchCartAdmin(id);
  }

  @Post('cart/:id/checkout')
  @ApiOperation({ summary: 'Checkout cart' })
  async checkout(
    @Param('id') id: string,
    @Body() body: OrderCreateDto,
    @Req() req,
  ) {
    return this.orderService.checkout(id, req.user?._id, body);
  }
}
