import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'prisma/prisma.client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/common/services';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    PrismaService,
    JwtService,
    ConfigService,
  ],
})
export class UsersModule {}
