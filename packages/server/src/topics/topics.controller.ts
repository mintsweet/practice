import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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

import { AuthOptional } from '@/auth/auth-optional.decorator';
import { Auth } from '@/auth/auth.decorator';
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

  @Auth()
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

  @Auth()
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

  @Auth()
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

  @AuthOptional()
  @Get(':id')
  public async queryOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.sub;
    try {
      const topic = await this.topics.queryById(id, userId);
      return topic;
    } catch (err) {
      this.handleError(err);
    }
  }

  @Auth()
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

  @Auth()
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

  @Auth()
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

  @Auth()
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

  @Auth()
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
