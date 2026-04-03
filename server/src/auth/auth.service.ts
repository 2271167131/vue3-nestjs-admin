import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getPermissions(username?: string): Promise<string[]> {
    if (!username) return [];

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        roles: {
          select: {
            role: {
              select: {
                permissions: {
                  select: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    const perms = user.roles.flatMap((ur) =>
      ur.role.permissions.map((p) => p.permission),
    );

    return Array.from(new Set(perms));
  }
}

