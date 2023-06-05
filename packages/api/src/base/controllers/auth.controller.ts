import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from '@auth';
import { SignUpDTO, SigninDTO } from '@dto';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  public async signup(@Body() payload: SignUpDTO): Promise<{ uid: string }> {
    const { email, password, nickname } = payload;

    try {
      const uid = await this.auth.signup(email, password, nickname);
      return { uid };
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('signin')
  public async signin(
    @Body() payload: SigninDTO,
  ): Promise<{ accessToken: string }> {
    const { email, password } = payload;

    try {
      const accessToken = await this.auth.signin(email, password);
      return { accessToken };
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
