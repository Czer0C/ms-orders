import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() orderData: Partial<Order>,
    @Req() req: Request,
  ): Promise<Order> {
    const user = req['user']; // Retrieved from AuthMiddleware

    orderData.createdBy = user.username || 'unknown';

    return this.ordersService.create(orderData);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order | null> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() orderData: Partial<Order>,
  ): Promise<Order | null> {
    return this.ordersService.update(id, orderData);
  }

  @Delete('/many')
  async removeMany(@Body() ids: number[]): Promise<void> {
    return this.ordersService.removeMany(ids);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.remove(id);
  }

  @Put(':id/pay')
  async complete(@Param('id') id: number): Promise<Order | null> {
    return this.ordersService.pay(id);
  }
}
