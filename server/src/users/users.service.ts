import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // 路径必须正确
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // 1. 构造函数里必须有这两个参数
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  // 注册逻辑
  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    // 1. 先检查用户是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 创建用户
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
  }

  // 登录逻辑
  async login(username: string, password: string) {
    // 1. 查用户
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('用户不存在');

    // 2. 验密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('账号密码错误');

    // 3. 发 token
    const token = this.jwtService.sign({ username: user.username });
    return { token, username: user.username };
  }

  async getUserList(params?: { page?: number; pageSize?: number; keyword?: string }) {
    const page = Math.max(1, Number(params?.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(params?.pageSize || 10)));
    const keyword = (params?.keyword || '').trim();

    const where = keyword
      ? {
          username: {
            contains: keyword,
          },
        }
      : undefined;

    const [total, list] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { list, total, page, pageSize };
  }

  // 新增删除用户方法
  async deleteUser(id: number) {
    // 先检查用户是否存在
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');

    // 删除用户
    await this.prisma.user.delete({ where: { id } });
    return { message: '删除成功' };
  }

  async getProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, createdAt: true, updatedAt: true }
    });

    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  // 修改当前登录用户的密码（基于 token 里的 username）
  async changePassword(username: string, oldPwd: string, newPwd: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('用户不存在');

    // 验证旧密码
    const isMatch = await bcrypt.compare(oldPwd, user.password);
    if (!isMatch) throw new BadRequestException('旧密码错误');

    // 加密新密码
    const hashedNewPwd = await bcrypt.hash(newPwd, 10);

    // 更新密码
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPwd }
    });

    return { code: 200, message: '密码修改成功，请重新登录' };
  }
}