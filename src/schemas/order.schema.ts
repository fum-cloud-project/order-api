import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Cart } from './cart.schema';

@Schema({ collection: 'order' })
export class Order {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cart' }],
    required: true,
  })
  cart: Cart;

  @Prop({ type: String, required: true, default: 'pending' })
  status: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;
