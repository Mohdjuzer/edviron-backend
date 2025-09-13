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

  // Create a new Order
  async createOrder(orderDto: Partial<Order>): Promise<Order> {
    const createdOrder = new this.orderModel(orderDto);
    return createdOrder.save();
  }

  // Create new OrderStatus entry
  async createOrderStatus(orderStatusDto: Partial<OrderStatus>): Promise<OrderStatus> {
    const createdOrderStatus = new this.orderStatusModel(orderStatusDto);
    return createdOrderStatus.save();
  }

  // Update OrderStatus by custom_order_id
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

  // Fetch all transactions: aggregate order + order_status data
  async getAllTransactions() {
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

  // Fetch transactions by school id
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

  // Check transaction status by custom order id
  async getTransactionStatus(customOrderId: string) {
    const transaction = await this.orderStatusModel.findOne({ custom_order_id: customOrderId });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
