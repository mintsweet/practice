import {
  Controller,
  Get,
  UseGuards,
  Request,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService, AuthGuard } from '@auth';

@Controller()
export class ProfileController {
  constructor(private auth: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  public async getProfile(@Request() req) {
    const { email } = req.user;

    try {
      return this.auth.getProfile(email);
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
