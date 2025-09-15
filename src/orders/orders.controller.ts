import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Get all transactions
  @Get('transactions')
  async fetchAllTransactions() {
    return this.ordersService.getAllTransactions();
  }

  // Get transactions by school
  @Get('transactions/school/:schoolId')
  async fetchTransactionsBySchool(@Param('schoolId') schoolId: string) {
    return this.ordersService.getTransactionsBySchool(schoolId);
  }

  // Get status of a specific transaction
  @Get('transaction-status/:customOrderId')
  async checkTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.ordersService.getTransactionStatus(customOrderId);
  }

  // Handle payment gateway webhook
  @Post('/webhook')
  async handleWebhook(@Body() payload: any) {
    return this.ordersService.updateOrderStatusFromWebhook(payload);
  }

  // Create a payment
  @Post('create-payment')
  async createPayment(@Body() dto: CreatePaymentDto, @Res() res: Response) {
    const paymentUrl = await this.ordersService.createPayment(dto);
    return res.json({ paymentUrl }); // Or: res.redirect(paymentUrl);
  }
}
