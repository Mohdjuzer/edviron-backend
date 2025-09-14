import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { OrderStatus, OrderStatusDocument } from './order-status.schema';


@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  //Create a new Order
  async createOrder(orderDto: Partial<Order>): Promise<Order> {
    const createdOrder = new this.orderModel(orderDto);
    return createdOrder.save();
  }

  //Create new OrderStatus entry
  async createOrderStatus(orderStatusDto: Partial<OrderStatus>): Promise<OrderStatus> {
    const createdOrderStatus = new this.orderStatusModel(orderStatusDto);
    return createdOrderStatus.save();
  }

  //Update OrderStatus by custom_order_id
  async updateOrderStatusByCustomOrderId(
    customOrderId: string,
    updateData: Partial<OrderStatus>
  ): Promise<OrderStatus> {
    const updated = await this.orderStatusModel.findOneAndUpdate(
      { custom_order_id: customOrderId },
      updateData,
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException(`OrderStatus with custom_order_id ${customOrderId} not found`);
    }
    return updated;
  }

  //Handle webhook to update OrderStatus (by custom_order_id or collect_id)
async updateOrderStatusFromWebhook(payload: any): Promise<OrderStatus> {
  const {
    order_info: {
      order_id,
      order_amount,
      transaction_amount,
      gateway,
      bank_reference,
      status,
      payment_mode,
      payemnt_details: payment_details,
      Payment_message: payment_message,
      payment_time,
      error_message,
    },
  } = payload;

  const update = {
    order_amount,
    transaction_amount,
    gateway,
    bank_reference,
    status,
    payment_mode,
    payment_details,
    payment_message,
    payment_time,
    error_message,
  };

  // 1. Try update by custom_order_id (string)
  let orderStatusUpdate = await this.orderStatusModel.findOneAndUpdate(
    { custom_order_id: order_id },
    update,
    { new: true }
  );

  // 2. Fallback to collect_id (ObjectId), but only if it's valid
  if (!orderStatusUpdate && Types.ObjectId.isValid(order_id)) {
    orderStatusUpdate = await this.orderStatusModel.findOneAndUpdate(
      { collect_id: new Types.ObjectId(order_id) },
      update,
      { new: true }
    );
  }

  if (!orderStatusUpdate) {
    throw new NotFoundException('OrderStatus not found for provided order_id');
  }

  return orderStatusUpdate;
}

  // Get all transactions (combine Order + OrderStatus)
  async getAllTransactions() {
    return this.orderStatusModel.aggregate([
      {
        $lookup: {
          from: 'orders',                // collection name in MongoDB
          localField: 'collect_id',      // field in OrderStatus
          foreignField: '_id',           // matching field in Orders
          as: 'order',                   // result field
        },
      },
      { $unwind: '$order' },
      {
        $project: {
          collect_id: 1,
          school_id: '$order.school_id',
          gateway: '$order.gateway_name',
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: 1,
        },
      },
    ]);
  }

  // Get transactions by school ID
  async getTransactionsBySchool(schoolId: string | Types.ObjectId) {
    return this.orderStatusModel.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: '$order' },
      {
        $match: {
          'order.school_id': schoolId,
        },
      },
      {
        $project: {
          collect_id: 1,
          school_id: '$order.school_id',
          gateway: '$order.gateway_name',
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          custom_order_id: 1,
        },
      },
    ]);
  }

  // Get a specific transaction status by custom_order_id
  async getTransactionStatus(customOrderId: string) {
    const transaction = await this.orderStatusModel.findOne({ custom_order_id: customOrderId });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
