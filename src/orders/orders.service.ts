import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.ordersRepository.create(orderData);

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number, ...rest: any): Promise<Order | null> {
    const user = rest[0];

    return this.ordersRepository.findOne({
      where: { id, createdBy: user.username },
    });
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order | null> {
    await this.ordersRepository.update(id, orderData);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async removeMany(ids: number[]): Promise<void> {
    await this.ordersRepository.delete(ids);
  }

  async pay(id: number): Promise<Order | null> {
    await this.ordersRepository.update(id, { status: 'completed' });

    return this.findOne(id);
  }
}
