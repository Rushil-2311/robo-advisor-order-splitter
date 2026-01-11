import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { OrdersModule } from './orders/orders.module';
import { PricingModule } from './pricing/pricing.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { HistoryModule } from './history/history.module';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    OrdersModule,
    PricingModule,
    PortfolioModule,
    HistoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}
