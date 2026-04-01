import { Controller, Post, Body, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';




@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
  getProfile() {
    return {
      message: '你已登录，可以访问用户信息',
    };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard) // 必须登录才能看用户列表
  async getUserList() {
    return this.usersService.getUserList();
  }

  // 新增删除接口
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  // 新增修改密码接口（重点：路径是 change-password）
  @Post('change-password') // 接口路径：/users/change-password
  @UseGuards(JwtAuthGuard) // 必须登录才能改密码
  async changePassword(@Body() body: { oldPwd: string; newPwd: string }) {
    // 校验参数是否存在
    if (!body.oldPwd || !body.newPwd) {
      return { code: 400, message: '旧密码和新密码不能为空' };
    }
    return this.usersService.changePassword(body.oldPwd, body.newPwd);
  }
}