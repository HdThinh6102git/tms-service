import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from '../constants';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard
  extends AuthGuard(STRATEGY_JWT_AUTH)
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    const http = context.switchToHttp();
    const { headers } = http.getRequest();
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    const authorization = headers.authorization.replace('Bearer ', '');
    try {
      const payload = await this.jwtService.verifyAsync(authorization, {
        secret: this.configService.get<string>('jwt.privateKey'),
      });
      headers.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
