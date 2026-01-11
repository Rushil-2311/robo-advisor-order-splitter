import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';
import { PricingService } from '../pricing/pricing.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { HistoryService } from '../history/history.service';
import { DateUtils } from '../common/utils/date.utils';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly shareDecimalPrecision: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly pricingService: PricingService,
    private readonly portfolioService: PortfolioService,
    private readonly historyService: HistoryService,
  ) {
    this.shareDecimalPrecision = this.configService.get<number>('shareDecimalPrecision', 4);
  }

  async splitOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.log(
      `Creating ${createOrderDto.orderType} order for ₹${createOrderDto.totalAmount}`,
    );

    const symbols = createOrderDto.modelPortfolio.map((allocation) => allocation.symbol);

    const priceMap = this.pricingService.getPrices(symbols, createOrderDto.marketPrices);

    const stockOrders = this.portfolioService.calculateStockOrders(
      createOrderDto.modelPortfolio,
      createOrderDto.totalAmount,
      priceMap,
      this.shareDecimalPrecision,
    );

    const currentDate = new Date();
    const executionDate = DateUtils.getNextTradingDay(currentDate);

    const orderId = uuidv4();
    const order = new Order(
      orderId,
      createOrderDto.orderType,
      createOrderDto.totalAmount,
      executionDate,
      stockOrders,
    );

    this.historyService.saveOrder(order);

    this.logger.log(`Order ${orderId} created successfully. Execution date: ${executionDate}`);

    return this.mapToResponseDto(order);
  }

  async getOrderHistory(): Promise<OrderResponseDto[]> {
    const orders = this.historyService.getAllOrders();
    this.logger.log(`Retrieved ${orders.length} orders from history`);
    return orders.map((order) => this.mapToResponseDto(order));
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
    return {
      orderId: order.orderId,
      orderType: order.orderType,
      totalAmount: order.totalAmount,
      executionDate: order.executionDate,
      stocks: order.stocks.map((stock) => ({
        symbol: stock.symbol,
        amount: stock.amount,
        quantity: stock.quantity,
        price: stock.price,
      })),
      createdAt: order.createdAt,
    };
  }
}
