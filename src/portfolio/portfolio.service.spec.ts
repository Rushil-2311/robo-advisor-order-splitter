import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  let service: PortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioService],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validatePortfolio', () => {
    it('should validate portfolio with weights summing to 1', () => {
      const portfolio = [
        { symbol: 'AAPL', weight: 0.5 },
        { symbol: 'GOOGL', weight: 0.3 },
        { symbol: 'MSFT', weight: 0.2 },
      ];

      expect(() => service.validatePortfolio(portfolio)).not.toThrow();
    });

    it('should throw error when weights do not sum to 1', () => {
      const portfolio = [
        { symbol: 'AAPL', weight: 0.5 },
        { symbol: 'GOOGL', weight: 0.3 },
      ];

      expect(() => service.validatePortfolio(portfolio)).toThrow(BadRequestException);
      expect(() => service.validatePortfolio(portfolio)).toThrow(/must sum to 1/);
    });

    it('should throw error for negative weights', () => {
      const portfolio = [
        { symbol: 'AAPL', weight: 0.5 },
        { symbol: 'GOOGL', weight: 0.6 },
        { symbol: 'MSFT', weight: -0.1 },
      ];

      expect(() => service.validatePortfolio(portfolio)).toThrow(BadRequestException);
      expect(() => service.validatePortfolio(portfolio)).toThrow(/cannot be negative/);
    });

    it('should allow small floating point errors', () => {
      const portfolio = [
        { symbol: 'AAPL', weight: 0.3333 },
        { symbol: 'GOOGL', weight: 0.3333 },
        { symbol: 'MSFT', weight: 0.3334 },
      ];

      expect(() => service.validatePortfolio(portfolio)).not.toThrow();
    });
  });

  describe('calculateStockOrders', () => {
    it('should calculate stock orders correctly', () => {
      const portfolio = [
        { symbol: 'AAPL', weight: 0.5 },
        { symbol: 'GOOGL', weight: 0.3 },
        { symbol: 'MSFT', weight: 0.2 },
      ];
      const totalAmount = 10000;
      const priceMap = new Map([
        ['AAPL', 150],
        ['GOOGL', 2800],
        ['MSFT', 300],
      ]);
      const precision = 4;

      const orders = service.calculateStockOrders(portfolio, totalAmount, priceMap, precision);

      expect(orders).toHaveLength(3);

      expect(orders[0].symbol).toBe('AAPL');
      expect(orders[0].amount).toBe(5000);
      expect(orders[0].price).toBe(150);
      expect(orders[0].quantity).toBe(33.3333);

      expect(orders[1].symbol).toBe('GOOGL');
      expect(orders[1].amount).toBe(3000);
      expect(orders[1].price).toBe(2800);
      expect(orders[1].quantity).toBe(1.0714);

      expect(orders[2].symbol).toBe('MSFT');
      expect(orders[2].amount).toBe(2000);
      expect(orders[2].price).toBe(300);
      expect(orders[2].quantity).toBe(6.6667);
    });

    it('should throw error if price not found for symbol', () => {
      const portfolio = [{ symbol: 'AAPL', weight: 1.0 }];
      const totalAmount = 10000;
      const priceMap = new Map([['GOOGL', 2800]]);
      const precision = 4;

      expect(() =>
        service.calculateStockOrders(portfolio, totalAmount, priceMap, precision),
      ).toThrow(BadRequestException);
      expect(() =>
        service.calculateStockOrders(portfolio, totalAmount, priceMap, precision),
      ).toThrow(/Price not found for symbol/);
    });

    it('should handle single stock portfolio', () => {
      const portfolio = [{ symbol: 'AAPL', weight: 1.0 }];
      const totalAmount = 5000;
      const priceMap = new Map([['AAPL', 100]]);
      const precision = 2;

      const orders = service.calculateStockOrders(portfolio, totalAmount, priceMap, precision);

      expect(orders).toHaveLength(1);
      expect(orders[0].symbol).toBe('AAPL');
      expect(orders[0].amount).toBe(5000);
      expect(orders[0].quantity).toBe(50);
    });
  });
});
