import {
  Controller,
  Get,
  Put,
  Body,
  Request,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService, Role } from '@auth';
import { UserRole } from '@entities';
import { ProfileDTO } from '@dto';

@Controller()
export class ProfileController {
  constructor(private auth: AuthService) {}

  @Role(UserRole.USER)
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

  @Role(UserRole.USER)
  @Put('profile')
  public async updateProfile(@Request() req, @Body() payload: ProfileDTO) {
    const { email } = req.user;
    const { nickname, signature, oldPass, newPass } = payload;

    try {
      await this.auth.updateProfile(email, {
        nickname,
        signature,
        oldPass,
        newPass,
      });
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
