import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'nest-vue-admin-secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [UsersController], // 必须在这里！否则控制器不生效
  providers: [UsersService],
  exports: [JwtModule], // 导出 JwtModule，让守卫（Guard）可以使用 JwtService
})
export class UsersModule {}
