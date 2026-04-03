import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  getPermissions(@Req() req: Request) {
    const username = (req as any).user?.username;
    return this.authService.getPermissions(username);
  }
}

