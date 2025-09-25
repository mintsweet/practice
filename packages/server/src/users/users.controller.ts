import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';

import { AuthOptional } from '@/auth/auth-optional.decorator';
import { Auth } from '@/auth/auth.decorator';
import { CustomError } from '@/common/error';

import { USER_ERROR_CODE } from './error-code';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly user: UsersService) {}

  private errorHandle(err) {
    if (err instanceof CustomError) {
      switch (err.code) {
        case USER_ERROR_CODE.User_Not_Found:
          throw new NotFoundException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }
    throw new InternalServerErrorException(err.message);
  }

  @AuthOptional()
  @Get(':id')
  public async queryById(@Param('id') id: string, @Request() req) {
    const userId = req.user?.sub;
    try {
      const user = await this.user.queryById(id, userId);
      return user;
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth()
  @Post(':id/follow')
  public async follow(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    try {
      await this.user.follow(userId, id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth()
  @Delete(':id/follow')
  public async unfollow(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    try {
      await this.user.unfollow(userId, id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }
}
