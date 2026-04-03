import { Controller, Post, Body, UseGuards, Get, Delete, Param, Req, BadRequestException, UnauthorizedException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import type { Request } from 'express';




@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.usersService.login(username, password);
  }

  // 新增：需要登录才能访问的接口
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const username = (req as any).user?.username;
    if (!username) throw new UnauthorizedException('请先登录');
    return this.usersService.getProfile(username);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard) // 必须登录才能看用户列表
  async getUserList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.usersService.getUserList({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      keyword,
    });
  }

  // 新增删除接口
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermission('system:user:delete')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  // 新增修改密码接口（重点：路径是 change-password）
  @Post('change-password') // 接口路径：/users/change-password
  @UseGuards(JwtAuthGuard) // 必须登录才能改密码
  async changePassword(@Req() req: Request, @Body() body: { oldPwd: string; newPwd: string }) {
    // 校验参数是否存在
    if (!body.oldPwd || !body.newPwd) {
      throw new BadRequestException('旧密码和新密码不能为空');
    }

    const username = (req as any).user?.username;
    if (!username) throw new UnauthorizedException('请先登录');

    return this.usersService.changePassword(username, body.oldPwd, body.newPwd);
  }
}