import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

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
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<Order | null> {
    const user = req['user'];

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
  async complete(@Param('id') id: number,@Req() req: Request): Promise<Order | null> {
    const token = req.headers['authorization'];

    return this.ordersService.pay(id, token);
  }
}
