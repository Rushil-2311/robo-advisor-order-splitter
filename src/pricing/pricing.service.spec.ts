import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PricingService } from './pricing.service';

describe('PricingService', () => {
  let service: PricingService;
  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: number) => {
      if (key === 'defaultStockPrice') return 100;
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrice', () => {
    it('should return default price when no market prices provided', () => {
      const price = service.getPrice('AAPL');
      expect(price).toBe(100);
    });

    it('should return market price when available', () => {
      const marketPrices = [
        { symbol: 'AAPL', price: 150.25 },
        { symbol: 'GOOGL', price: 2800.5 },
      ];

      expect(service.getPrice('AAPL', marketPrices)).toBe(150.25);
      expect(service.getPrice('GOOGL', marketPrices)).toBe(2800.5);
    });

    it('should return default price when symbol not in market prices', () => {
      const marketPrices = [{ symbol: 'AAPL', price: 150.25 }];

      expect(service.getPrice('GOOGL', marketPrices)).toBe(100);
    });
  });

  describe('getPrices', () => {
    it('should return prices for multiple symbols', () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT'];
      const marketPrices = [
        { symbol: 'AAPL', price: 150.25 },
        { symbol: 'GOOGL', price: 2800.5 },
      ];

      const priceMap = service.getPrices(symbols, marketPrices);

      expect(priceMap.get('AAPL')).toBe(150.25);
      expect(priceMap.get('GOOGL')).toBe(2800.5);
      expect(priceMap.get('MSFT')).toBe(100); // default
    });

    it('should return default prices when no market prices provided', () => {
      const symbols = ['AAPL', 'GOOGL'];
      const priceMap = service.getPrices(symbols);

      expect(priceMap.get('AAPL')).toBe(100);
      expect(priceMap.get('GOOGL')).toBe(100);
    });
  });
});
