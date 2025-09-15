import { Controller, Post, Body, Res, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { Response } from 'express';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // These routes DO require authentication
  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  async fetchAllTransactions() {
    return this.ordersService.getAllTransactions();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions/school/:schoolId')
  async fetchTransactionsBySchool(@Param('schoolId') schoolId: string) {
    return this.ordersService.getTransactionsBySchool(schoolId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transaction-status/:customOrderId')
  async checkTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.ordersService.getTransactionStatus(customOrderId);
  }

  
  @Post('/webhook')
  async handleWebhook(@Body() payload: any) {
    return this.ordersService.updateOrderStatusFromWebhook(payload);
  }

  
  @Post('create-payment')
  async createPayment(@Body() dto: CreatePaymentDto, @Res() res: Response) {
    const paymentUrl = await this.ordersService.createPayment(dto);
    return res.json({ paymentUrl });
  }
}
