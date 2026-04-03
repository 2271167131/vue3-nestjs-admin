import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './require-permission.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    // 未标记权限时，直接放行
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest<any>();
    const username = request?.user?.username;
    if (!username) throw new ForbiddenException('请先登录');

    const permissions = await this.authService.getPermissions(username);
    if (permissions.includes(requiredPermission)) return true;

    throw new ForbiddenException('没有权限');
  }
}

