import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 最小闭环：为 admin 账号创建 admin 角色，并赋予 system:user:delete 权限
  const role = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  await prisma.rolePermission.upsert({
    where: { roleId_permission: { roleId: role.id, permission: 'system:user:delete' } },
    update: {},
    create: { roleId: role.id, permission: 'system:user:delete' },
  });

  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!admin) {
    console.log('[seed] 未找到 admin 用户，跳过 user_role 绑定');
    return;
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: role.id } },
    update: {},
    create: { userId: admin.id, roleId: role.id },
  });

  console.log('[seed] admin 角色/权限/绑定已完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

