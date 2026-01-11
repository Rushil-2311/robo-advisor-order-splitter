import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { PricingService } from '../pricing/pricing.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { HistoryService } from '../history/history.service';
import { OrderType } from '../common/enums/order-type.enum';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let pricingService: PricingService;
  let portfolioService: PortfolioService;
  let historyService: HistoryService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: number) => {
      if (key === 'shareDecimalPrecision') return 4;
      if (key === 'defaultStockPrice') return 100;
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        PricingService,
        PortfolioService,
        HistoryService,
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    pricingService = module.get<PricingService>(PricingService);
    portfolioService = module.get<PortfolioService>(PortfolioService);
    historyService = module.get<HistoryService>(HistoryService);

    historyService.clearHistory();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('splitOrder', () => {
    it('should create and split a BUY order correctly', async () => {
      const createOrderDto: CreateOrderDto = {
        modelPortfolio: [
          { symbol: 'AAPL', weight: 0.5 },
          { symbol: 'GOOGL', weight: 0.3 },
          { symbol: 'MSFT', weight: 0.2 },
        ],
        totalAmount: 10000,
        orderType: OrderType.BUY,
        marketPrices: [
          { symbol: 'AAPL', price: 150 },
          { symbol: 'GOOGL', price: 2800 },
          { symbol: 'MSFT', price: 300 },
        ],
      };

      const result = await service.splitOrder(createOrderDto);

      expect(result).toBeDefined();
      expect(result.orderId).toBeDefined();
      expect(result.orderType).toBe(OrderType.BUY);
      expect(result.totalAmount).toBe(10000);
      expect(result.executionDate).toBeDefined();
      expect(result.stocks).toHaveLength(3);

      // Verify AAPL allocation
      const aaplOrder = result.stocks.find((s) => s.symbol === 'AAPL');
      expect(aaplOrder).toBeDefined();
      expect(aaplOrder?.amount).toBe(5000);
      expect(aaplOrder?.price).toBe(150);
      expect(aaplOrder?.quantity).toBe(33.3333);

      // Verify order was saved to history
      expect(historyService.getOrderCount()).toBe(1);
    });

    it('should create and split a SELL order correctly', async () => {
      const createOrderDto: CreateOrderDto = {
        modelPortfolio: [{ symbol: 'AAPL', weight: 1.0 }],
        totalAmount: 5000,
        orderType: OrderType.SELL,
      };

      const result = await service.splitOrder(createOrderDto);

      expect(result.orderType).toBe(OrderType.SELL);
      expect(result.totalAmount).toBe(5000);
      expect(result.stocks).toHaveLength(1);
    });

    it('should use default prices when market prices not provided', async () => {
      const createOrderDto: CreateOrderDto = {
        modelPortfolio: [{ symbol: 'AAPL', weight: 1.0 }],
        totalAmount: 10000,
        orderType: OrderType.BUY,
      };

      const result = await service.splitOrder(createOrderDto);

      const aaplOrder = result.stocks.find((s) => s.symbol === 'AAPL');
      expect(aaplOrder?.price).toBe(100); // default price
    });

    it('should calculate execution date as next trading day', async () => {
      const createOrderDto: CreateOrderDto = {
        modelPortfolio: [{ symbol: 'AAPL', weight: 1.0 }],
        totalAmount: 10000,
        orderType: OrderType.BUY,
      };

      const result = await service.splitOrder(createOrderDto);

      expect(result.executionDate).toBeDefined();
      expect(result.executionDate).toBeInstanceOf(Date);

      // Execution date should be a weekday
      const dayOfWeek = result.executionDate.getDay();
      expect(dayOfWeek).toBeGreaterThanOrEqual(1);
      expect(dayOfWeek).toBeLessThanOrEqual(5);
    });
  });

  describe('getOrderHistory', () => {
    it('should return empty array when no orders', async () => {
      const history = await service.getOrderHistory();
      expect(history).toEqual([]);
    });

    it('should return all created orders', async () => {
      const createOrderDto1: CreateOrderDto = {
        modelPortfolio: [{ symbol: 'AAPL', weight: 1.0 }],
        totalAmount: 10000,
        orderType: OrderType.BUY,
      };

      const createOrderDto2: CreateOrderDto = {
        modelPortfolio: [{ symbol: 'GOOGL', weight: 1.0 }],
        totalAmount: 5000,
        orderType: OrderType.SELL,
      };

      await service.splitOrder(createOrderDto1);
      await service.splitOrder(createOrderDto2);

      const history = await service.getOrderHistory();

      expect(history).toHaveLength(2);
      expect(history[0].orderType).toBe(OrderType.BUY);
      expect(history[1].orderType).toBe(OrderType.SELL);
    });
  });
});
