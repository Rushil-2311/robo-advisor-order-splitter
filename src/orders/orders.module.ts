import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PricingModule } from '../pricing/pricing.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [PricingModule, PortfolioModule, HistoryModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
