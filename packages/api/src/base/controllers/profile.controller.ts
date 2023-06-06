import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService, AuthGuard } from '@auth';
import { ProfileDTO } from '@dto';

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

  @UseGuards(AuthGuard)
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
