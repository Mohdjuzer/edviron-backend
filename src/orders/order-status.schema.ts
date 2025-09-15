import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  collect_id: Types.ObjectId;  

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop({ required: true })
  payment_mode: string;

  @Prop({ type: Object })
  payment_details: Record<string, any>;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  error_message: string;

  @Prop({ required: true })
  payment_time: Date;

  @Prop({ required: true })
  custom_order_id: string;

}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

// Added required indexes as per edviron
OrderStatusSchema.index({ custom_order_id: 1 });
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ payment_time: 1 });
OrderStatusSchema.index({ status: 1 });
OrderStatusSchema.index({ transaction_amount: 1 });
