import { Controller, Post, Get, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  // Splits an order based on model portfolio allocation
  // POST /api/orders/split
  @Post('split')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Split an order based on portfolio allocation',
    description:
      'Creates an order by splitting the total amount across stocks according to the model portfolio weights. ' +
      'Returns order details including execution date, stock allocations, and share quantities.',
  })
  @ApiResponse({
    status: 200,
    description: 'Order successfully created and split',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data (e.g., portfolio weights not summing to 1)',
  })
  async splitOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.log(`Received split order request: ${createOrderDto.orderType}`);
    return this.ordersService.splitOrder(createOrderDto);
  }

   // Retrieves order history
   // GET /api/orders/history
  @Get('history')
  @ApiOperation({
    summary: 'Get order history',
    description: 'Retrieves all previously created orders from the in-memory store.',
  })
  @ApiResponse({
    status: 200,
    description: 'Order history retrieved successfully',
    type: [OrderResponseDto],
  })
  async getOrderHistory(): Promise<OrderResponseDto[]> {
    this.logger.log('Received order history request');
    return this.ordersService.getOrderHistory();
  }
}
