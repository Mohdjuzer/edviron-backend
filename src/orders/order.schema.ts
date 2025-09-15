import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  school_id: Types.ObjectId | string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  trustee_id: Types.ObjectId | string;

  @Prop({
    required: true,
    type: {
      name: String,
      id: String,
      email: String,
    },
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop({ required: true })
  gateway_name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);


OrderSchema.index({ school_id: 1 });
