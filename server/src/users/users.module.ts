import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'nest-vue-admin-secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [UsersController], // 必须在这里！否则控制器不生效
  providers: [UsersService, PrismaService],
  exports: [JwtModule], // 导出 JwtModule，让守卫（Guard）可以使用 JwtService
})
export class UsersModule {}
