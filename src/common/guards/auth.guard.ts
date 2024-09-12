import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.client';
import { JwtService } from '../services';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const authorization = ctx.getContext().req?.headers?.authorization;
      const bearer = authorization.split(' ')[0];
      const token = authorization.split(' ')[1];

      if (bearer !== 'Bearer' || !token)
        throw new UnauthorizedException('Unauthorized access');

      //   verify jwtToken
      const decodedToken = this.jwtService.verifyToken(token);

      //   check if user still exist on the db
      const user = await this.prisma.user.findUnique({
        where: { id: decodedToken.sub },
      });
      if (!user) throw new UnauthorizedException('Unauthorized access');

      ctx.getContext().req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
