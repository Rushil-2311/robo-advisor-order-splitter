import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { OrderType } from '../../common/enums/order-type.enum';

export class StockAllocationDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'AAPL',
  })
  @IsOptional()
  symbol!: string;

  @ApiProperty({
    description: 'Weight/percentage of the stock in the portfolio (0-1)',
    example: 0.5,
  })
  @IsNumber()
  @Min(0)
  weight!: number;
}

export class MarketPriceDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'AAPL',
  })
  @IsOptional()
  symbol!: string;

  @ApiProperty({
    description: 'Current market price of the stock',
    example: 150.25,
  })
  @IsNumber()
  @Min(0)
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of stock allocations defining the model portfolio',
    type: [StockAllocationDto],
    example: [
      { symbol: 'AAPL', weight: 0.5 },
      { symbol: 'GOOGL', weight: 0.3 },
      { symbol: 'MSFT', weight: 0.2 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StockAllocationDto)
  modelPortfolio!: StockAllocationDto[];

  @ApiProperty({
    description: 'Total amount to invest or divest',
    example: 10000,
  })
  @IsNumber()
  @Min(0.01)
  totalAmount!: number;

  @ApiProperty({
    description: 'Type of order: BUY or SELL',
    enum: OrderType,
    example: OrderType.BUY,
  })
  @IsEnum(OrderType)
  orderType!: OrderType;

  @ApiProperty({
    description: 'Optional array of current market prices for stocks',
    type: [MarketPriceDto],
    required: false,
    example: [
      { symbol: 'AAPL', price: 150.25 },
      { symbol: 'GOOGL', price: 2800.5 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketPriceDto)
  marketPrices?: MarketPriceDto[];
}
