import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

import * as dotenv from 'dotenv';

dotenv.config();

//auth-service in docker

const HOST = process.env.HOST_AUTH || 'auth-service';

const VALIDATE_ENDPOINT = `http://${HOST}:3002/auth/validate`;

console.log(process.env.HOST_AUTH, { VALIDATE_ENDPOINT });
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  // constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const response = await axios.get(VALIDATE_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.username)
        throw new UnauthorizedException('Invalid token');

      req['user'] = response?.data;

      next();
    } catch (error) {
      console.log('exception caught', error?.response?.data);
      throw new UnauthorizedException('Exception caught in server');
    }
  }
}
