import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'requiredPermission';

// 用法示例：@RequirePermission('system:user:delete')
export const RequirePermission = (permission: string) =>
  SetMetadata(PERMISSION_KEY, permission);

