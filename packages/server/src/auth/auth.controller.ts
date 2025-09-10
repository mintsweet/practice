import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDTO, SignInDTO, UpdateMeDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  public async signup(@Body() payload: SignUpDTO) {
    const { email, password, nickname } = payload;

    try {
      const userId = await this.auth.signup(email, password, nickname);
      return userId;
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Post('signin')
  public async signin(
    @Body() paylod: SignInDTO,
    @Res({ passthrough: true }) res,
  ) {
    const { email, password } = paylod;

    try {
      const { accessToken, refreshToken } = await this.auth.signin(
        email,
        password,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:
          parseInt(this.auth['config'].get('JWT_REFRESH_TTL') ?? '30', 10) *
          24 *
          60 *
          60 *
          1000,
      });

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: err.message,
      });
    }
  }

  @Post('refresh')
  public async refresh(@Req() req) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken)
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Missing refresh token',
      });

    const decoded = await this.auth['jwt'].verifyAsync(refreshToken, {
      secret: this.auth['config'].get('JWT_REFRESH_SECRET'),
    });

    return this.auth.refresh(decoded.sub, refreshToken);
  }

  @Post('signout')
  public async signout(@Req() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return { status: 'OK' };

    const decoded = await this.auth['jwt'].verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.auth.signout(decoded.sub, refreshToken);
    res.clearCookie('refreshToken');

    return { status: 'OK' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  public async getMe(@Request() req) {
    const user = await this.auth.getMe(req.user.sub);
    return user;
  }

  @UseGuards(AuthGuard)
  @Put('me')
  public async updateMe(@Request() req, @Body() payload: UpdateMeDTO) {
    const user = await this.auth.updateMe(req.user.sub, payload);
    return user;
  }
}
