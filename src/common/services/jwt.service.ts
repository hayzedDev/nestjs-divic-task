import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  // Sign JWT token
  signToken(userId: string): string {
    const tokenSecret = this.configService.get<string>('TOKEN_SECRET');
    const tokenExpiry = this.configService.get<string>('TOKEN_EXPIRES_IN');

    const payload: JwtPayload = { sub: userId };
    return jwt.sign(payload, tokenSecret, { expiresIn: tokenExpiry });
  }

  // Verify JWT token
  verifyToken(token: string): JwtPayload {
    const tokenSecret = this.configService.get<string>('TOKEN_SECRET');
    return jwt.verify(token, tokenSecret) as JwtPayload;
  }
}
