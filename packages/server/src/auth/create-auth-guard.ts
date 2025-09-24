import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { MIN_ROLE } from './constant';

export function createAuthGuard(forceLogin: boolean): Type<CanActivate> {
  @Injectable()
  class BaseAuthGuard implements CanActivate {
    constructor(
      private readonly config: ConfigService,
      private readonly jwt: JwtService,
      private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      let user = null;

      if (token) {
        try {
          user = await this.jwt.verifyAsync(token, {
            secret: this.config.get('JWT_SECRET'),
          });
          request['user'] = user;
        } catch {
          throw new UnauthorizedException({
            status: HttpStatus.UNAUTHORIZED,
            error: 'Invalid signature.',
          });
        }
      }

      const minRole = this.reflector.getAllAndOverride<number>(MIN_ROLE, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (minRole !== undefined && !user) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Please log in first.',
        });
      }

      if (minRole !== undefined) {
        if (typeof user.role !== 'number' || user.role < minRole) {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            error: 'Insufficient role.',
          });
        }
      }

      if (!minRole && forceLogin && !user) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Please log in first.',
        });
      }

      return true;
    }

    private extractTokenFromHeader(request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }

  return mixin(BaseAuthGuard);
}
