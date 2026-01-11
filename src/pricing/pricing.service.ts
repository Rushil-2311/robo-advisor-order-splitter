import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarketPrice } from '../common/interfaces/market-price.interface';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);
  private readonly defaultStockPrice: number;

  constructor(private readonly configService: ConfigService) {
    this.defaultStockPrice = this.configService.get<number>('defaultStockPrice', 100);
  }

  getPrice(symbol: string, marketPrices?: MarketPrice[]): number {
    if (marketPrices) {
      const marketPrice = marketPrices.find((mp) => mp.symbol === symbol);
      if (marketPrice) {
        this.logger.debug(`Using market price for ${symbol}: ${marketPrice.price}`);
        return marketPrice.price;
      }
    }

    this.logger.debug(`Using default price for ${symbol}: ${this.defaultStockPrice}`);
    return this.defaultStockPrice;
  }

  getPrices(symbols: string[], marketPrices?: MarketPrice[]): Map<string, number> {
    const priceMap = new Map<string, number>();

    for (const symbol of symbols) {
      priceMap.set(symbol, this.getPrice(symbol, marketPrices));
    }

    return priceMap;
  }
}
