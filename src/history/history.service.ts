import { Injectable, Logger } from '@nestjs/common';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);
  private readonly orders: Order[] = [];

  saveOrder(order: Order): void {
    this.orders.push(order);
    this.logger.log(`Order ${order.orderId} saved to history`);
  }

  getAllOrders(): Order[] {
    this.logger.debug(`Retrieving ${this.orders.length} orders from history`);
    return [...this.orders]; 
  }

  getOrderCount(): number {
    return this.orders.length;
  }

  clearHistory(): void {
    this.orders.length = 0;
    this.logger.log('Order history cleared');
  }
}
