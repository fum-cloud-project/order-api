import { Module } from '@nestjs/common';
import { OrderModule } from './modules/order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

console.log(process.env.MONGO_ORDERS_URI);
@Module({
  imports: [OrderModule, MongooseModule.forRoot(process.env.MONGO_ORDERS_URI)],
})
export class AppModule {}
