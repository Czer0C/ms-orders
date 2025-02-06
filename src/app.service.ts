import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PG_HOST } from 'src/enum';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST') || DEFAULT_PG_HOST;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
