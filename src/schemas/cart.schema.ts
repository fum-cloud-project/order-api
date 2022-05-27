import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class CartItem {
  @Prop()
  _id: ObjectId;
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  quantity: number;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ collection: 'cart' })
export class Cart {
  @Prop()
  userId: ObjectId;

  @Prop({ type: [CartItemSchema] })
  items: CartItem[];

  @Prop()
  total: number;

  @Prop()
  status: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

export type CartDocument = Cart & Document;
