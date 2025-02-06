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

  async create(orderData: Partial<Order>, user): Promise<Order> {
    // console.log({ user });

    const order = this.ordersRepository.create(orderData);

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order | null> {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order | null> {
    await this.ordersRepository.update(id, orderData);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async pay(id: number): Promise<Order | null> {
    await this.ordersRepository.update(id, { status: 'completed' });

    return this.findOne(id);
  }
}
