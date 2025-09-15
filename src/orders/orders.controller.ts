import { Body, Post, Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('transactions')
  async fetchAllTransactions() {
    return this.ordersService.getAllTransactions();
  }

  @Get('transactions/school/:schoolId')
  async fetchTransactionsBySchool(@Param('schoolId') schoolId: string) {
    return this.ordersService.getTransactionsBySchool(schoolId);
  }

  @Get('transaction-status/:customOrderId')
  async checkTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.ordersService.getTransactionStatus(customOrderId);
  }
  @Post('/webhook')
  async handleWebhook(@Body() payload: any) {
    return this.ordersService.updateOrderStatusFromWebhook(payload);
}
}
