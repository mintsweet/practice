import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService, Public } from '@/auth';

import { SignUpDTO, SigninDTO } from '../dtos';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('signup')
  public async signup(@Body() payload: SignUpDTO): Promise<{ uid: string }> {
    const { email, password, nickname } = payload;

    try {
      const uid = await this.auth.signup(email, password, nickname);
      return { uid };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Public()
  @Post('signin')
  public async signin(
    @Body() payload: SigninDTO,
  ): Promise<{ accessToken: string }> {
    const { email, password } = payload;

    try {
      const accessToken = await this.auth.signin(email, password);
      return { accessToken };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
