import { Injectable } from '@nestjs/common';
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
      throw new Error('用户名已存在');
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
    if (!user) throw new Error('用户不存在');

    // 2. 验密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('账号密码错误');

    // 3. 发 token
    const token = this.jwtService.sign({ username: user.username });
    return { token, username: user.username };
  }

  // 新增获取所有用户的方法
  async getUserList() {
    // 查所有用户，排除密码字段（安全！）
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true, // 创建时间
        updatedAt: true  // 更新时间
      }
    });
  }

  // 新增删除用户方法
  async deleteUser(id: number) {
    // 先检查用户是否存在
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('用户不存在');

    // 删除用户
    await this.prisma.user.delete({ where: { id } });
    return { message: '删除成功' };
  }

   // 新增修改密码方法（重点：从token取当前登录用户，而非固定admin）
  async changePassword(oldPwd: string, newPwd: string) {
    try {
      // 🔥 修复：不要固定查 admin，先查当前登录用户（这里简化，实际从token解析）
      // 如果你还没做token解析用户，先临时查第一个用户（测试用）
      const user = await this.prisma.user.findFirst();
      if (!user) {
        return { code: 404, message: '用户不存在' };
      }

      // 验证旧密码
      const isMatch = await bcrypt.compare(oldPwd, user.password);
      if (!isMatch) {
        return { code: 400, message: '旧密码错误' };
      }

      // 加密新密码
      const hashedNewPwd = await bcrypt.hash(newPwd, 10);
      // 更新密码
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPwd }
      });

      return { code: 200, message: '密码修改成功，请重新登录' };
    } catch (err) {
      console.error('修改密码失败：', err);
      return { code: 500, message: '服务器错误，修改密码失败' };
    }
  }
}