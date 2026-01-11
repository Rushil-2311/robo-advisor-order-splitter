import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StockAllocation } from '../common/interfaces/stock-allocation.interface';
import { StockOrder } from '../common/interfaces/stock-order.interface';
import { NumberUtils } from '../common/utils/number.utils';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  validatePortfolio(portfolio: StockAllocation[]): void {
    const totalWeight = portfolio.reduce((sum, allocation) => sum + allocation.weight, 0);

    // Allow small floating point errors (within 0.001)
    if (Math.abs(totalWeight - 1) > 0.001) {
      throw new BadRequestException(
        `Portfolio weights must sum to 1 (100%). Current sum: ${totalWeight}`,
      );
    }

    // Check for negative weights
    const negativeWeights = portfolio.filter((a) => a.weight < 0);
    if (negativeWeights.length > 0) {
      throw new BadRequestException('Portfolio weights cannot be negative');
    }

    this.logger.debug(`Portfolio validated. Total weight: ${totalWeight}`);
  }

  calculateStockOrders(
    portfolio: StockAllocation[],
    totalAmount: number,
    priceMap: Map<string, number>,
    precision: number,
  ): StockOrder[] {
    this.validatePortfolio(portfolio);

    const orders: StockOrder[] = [];

    for (const allocation of portfolio) {
      const price = priceMap.get(allocation.symbol);
      if (!price) {
        throw new BadRequestException(`Price not found for symbol: ${allocation.symbol}`);
      }

      const amount = NumberUtils.roundToPrecision(totalAmount * allocation.weight, 2);
      const quantity = NumberUtils.calculateShareQuantity(amount, price, precision);

      orders.push({
        symbol: allocation.symbol,
        amount,
        quantity,
        price,
      });

      this.logger.debug(
        `Calculated order for ${allocation.symbol}: ${quantity} shares at ₹${price} = ₹${amount}`,
      );
    }

    return orders;
  }
}
