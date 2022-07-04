 import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { Cart, CartSchema } from '../../schemas/cart.schema';
import { GrpcService } from './services/grpc.service';
import { PRODUCTS_PACKAGE } from './constants';
import { AUTH_PACKAGE } from '../auth/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: process.env.PRODUCT_GRPC_URL,
          package: 'product',
          protoPath: 'src/grpc/products.proto',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: AUTH_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_GRPC_URL,
          package: 'auth',
          protoPath: 'src/grpc/auth.proto',
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [GrpcService, OrderService],
})
export class OrderModule {}
