import {
  Controller,
  Patch,
  Delete,
  Post,
  Request,
  Param,
  Body,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/auth.guard';
import { CustomError } from '@/common/error';

import { REPLY_ERROR_CODE } from './error-code';
import { RepliesService } from './replies.service';

@Controller('replies')
export class RepliesController {
  constructor(private readonly replies: RepliesService) {}

  private errorHandle(err) {
    if (err instanceof CustomError) {
      switch (err.code) {
        case REPLY_ERROR_CODE.Reply_Not_Found:
          throw new NotFoundException(err.message);
        case REPLY_ERROR_CODE.Reply_Forbidden:
          throw new ForbiddenException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }

    throw new InternalServerErrorException('Something Error.');
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  public async update(
    @Request() req,
    @Param('id') id: string,
    @Body() payload: { content: string },
  ) {
    const userId = req.user.sub;
    try {
      await this.replies.update(id, userId, payload.content);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    try {
      await this.replies.remove(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/like')
  public async addLike(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    try {
      await this.replies.addLike(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id/like')
  public async removeLike(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    try {
      await this.replies.removeLike(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }
}
