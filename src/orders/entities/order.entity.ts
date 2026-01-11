import { OrderType } from '../../common/enums/order-type.enum';
import { StockOrder } from '../../common/interfaces/stock-order.interface';

export class Order {
  orderId!: string;
  orderType!: OrderType;
  totalAmount!: number;
  executionDate!: Date;
  stocks!: StockOrder[];
  createdAt!: Date;

  constructor(
    orderId: string,
    orderType: OrderType,
    totalAmount: number,
    executionDate: Date,
    stocks: StockOrder[],
  ) {
    this.orderId = orderId;
    this.orderType = orderType;
    this.totalAmount = totalAmount;
    this.executionDate = executionDate;
    this.stocks = stocks;
    this.createdAt = new Date();
  }
}
