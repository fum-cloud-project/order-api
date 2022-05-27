import {
  CanActivate,
  ExecutionContext,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { AUTH_PACKAGE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthService } from './authService.interface';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(@Inject(AUTH_PACKAGE) private client: ClientGrpc) {}

  private reflector = new Reflector();

  private usersService: AuthService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    const request = context.switchToHttp().getRequest<Request>();
    const isProtected = this.reflector.getAllAndOverride<boolean>('auth', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isProtected) {
      return true;
    }

    const jwt = request.headers.authorization;
    if (!jwt) {
      return false;
    }

    try {
      request['user'] = await this.usersService.GetUser({ jwt });
      const rpcRes = await this.usersService.HasAccess({
        jwt,
        path: request.url,
        method: request.method,
      });
      return rpcRes.hasAccess;
    } catch {
      return false;
    }
  }

  onModuleInit() {
    this.usersService = this.client.getService<AuthService>('AuthService');
  }
}
