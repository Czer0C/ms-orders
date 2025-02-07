import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import * as dotenv from 'dotenv';
import axios from 'axios';

import { ClientKafka } from '@nestjs/microservices';

dotenv.config();

const HOST_INVENTORY = process.env.HOST_INVENTORY || 'localhost';

const UPDATE_INVENTORY = `http://${HOST_INVENTORY}:3004/inventory`;

console.log(process.env.HOST_AUTH, { UPDATE_INVENTORY });
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.ordersRepository.create(orderData);

    await this.kafkaClient.emit('orders', { value: JSON.stringify(order) });

    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order | null> {
    // const user = rest[0];
    return this.ordersRepository.findOne({
      where: { id },
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

  async pay(id: number, token: string): Promise<Order | null> {
    await this.ordersRepository.update(id, { status: 'completed' });

    const order = await this.findOne(id);

    const url = `${UPDATE_INVENTORY}/${order?.product}`;

    try {
      await axios.put(url, null, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.log('exception caught', error);
      throw new UnauthorizedException('Exception caught in server');
    }

    return order;
  }
}
