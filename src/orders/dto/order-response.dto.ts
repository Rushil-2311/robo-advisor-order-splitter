import { ApiProperty } from '@nestjs/swagger';
import { OrderType } from '../../common/enums/order-type.enum';

export class StockOrderResponseDto {
  @ApiProperty({
    description: 'Stock symbol',
    example: 'AAPL',
  })
  symbol!: string;

  @ApiProperty({
    description: 'Amount allocated to this stock',
    example: 5000,
  })
  amount!: number;

  @ApiProperty({
    description: 'Quantity of shares to buy/sell',
    example: 33.3333,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Price per share used for calculation',
    example: 150.25,
  })
  price!: number;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique order identifier',
    example: 'a3b5c7d9-1234-5678-90ab-cdef12345678',
  })
  orderId!: string;

  @ApiProperty({
    description: 'Order type: BUY or SELL',
    enum: OrderType,
    example: OrderType.BUY,
  })
  orderType!: OrderType;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 10000,
  })
  totalAmount!: number;

  @ApiProperty({
    description: 'Execution date (next trading day if market is closed)',
    example: '2026-01-13T00:00:00.000Z',
  })
  executionDate!: Date;

  @ApiProperty({
    description: 'Array of stock orders with allocation details',
    type: [StockOrderResponseDto],
  })
  stocks!: StockOrderResponseDto[];

  @ApiProperty({
    description: 'Timestamp when the order was created',
    example: '2026-01-11T10:30:00.000Z',
  })
  createdAt!: Date;
}
