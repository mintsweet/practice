import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  Body,
  Query,
  Param,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/auth.guard';
import { CustomError } from '@/common/error';

import { CreateTopicDTO, QueryTopicsDTO, CreateReplyDTO } from './dtos';
import { TOPIC_ERROR_CODE } from './error-code';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topics: TopicsService) {}

  private handleError(err) {
    if (err instanceof CustomError) {
      switch (err.code) {
        case TOPIC_ERROR_CODE.Topic_Not_Found:
          throw new NotFoundException(err.message);
        case TOPIC_ERROR_CODE.Topic_Forbidden:
          throw new ForbiddenException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }
    throw new InternalServerErrorException(err.message);
  }

  @UseGuards(AuthGuard)
  @Post()
  public async create(@Request() req, @Body() payload: CreateTopicDTO) {
    const userId = req.user.sub;
    try {
      const topicId = await this.topics.create({
        ...payload,
        userId,
      });
      return topicId;
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;

    try {
      await this.topics.remove(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Request() req,
    @Body() payload: { content: string; tagIds: string[] },
  ) {
    const userId = req.user.sub;
    try {
      await this.topics.update(id, userId, payload);
    } catch (err) {
      this.handleError(err);
    }
  }

  @Get('')
  public async query(@Query() query: QueryTopicsDTO) {
    try {
      const [topics, total] = await this.topics.query(query);
      return {
        topics,
        total,
      };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Get(':id')
  public async queryOne(@Param('id') id: string) {
    try {
      const topic = await this.topics.queryById(id);
      return topic;
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/like')
  public async addLike(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    try {
      await this.topics.addLike(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id/like')
  public async removeLike(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    try {
      await this.topics.removeLike(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/collect')
  public async addCollect(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    try {
      await this.topics.addCollect(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id/collect')
  public async removeCollect(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    try {
      await this.topics.removeCollect(id, userId);
      return { status: 'OK' };
    } catch (err) {
      this.handleError(err);
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/reply')
  public async reply(
    @Request() req,
    @Param('id') id: string,
    @Body() payload: CreateReplyDTO,
  ) {
    const userId = req.user.sub;
    try {
      const replyId = await this.topics.reply(id, userId, payload);
      return replyId;
    } catch (err) {
      this.handleError(err);
    }
  }
}
