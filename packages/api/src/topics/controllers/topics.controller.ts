import {
  Controller,
  Request,
  Param,
  Query,
  Post,
  Delete,
  Put,
  Get,
  Body,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { Role, Public } from '@auth';

import { TopicsService } from '../topics.service';
import {
  CreateTopicDTO,
  UpdateTopicDTO,
  QueryTopicDTO,
  CreateCommentDTO,
} from '../dtos';

@Controller('topics')
export class TopicsController {
  constructor(private topics: TopicsService) {}

  @Role()
  @Post()
  public async create(@Request() req, @Body() data: CreateTopicDTO) {
    const { email } = req;
    const { tab, title, content } = data;

    try {
      await this.topics.createTopic(email, tab, title, content);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role()
  @Delete(':id')
  public async delete(@Param(':id') id: string) {
    try {
      await this.topics.deleteTopic(id);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role()
  @Put(':id')
  public async update(@Param(':id') id: string, @Body() data: UpdateTopicDTO) {
    try {
      await this.topics.updateTopic(id, data);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Public()
  @Get()
  public async query(@Query() query: QueryTopicDTO) {
    const { page, pageSize } = query;
    try {
      const topics = await this.topics.getTopics(page, pageSize);
      return topics;
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
      const topic = await this.topics.getTopic(id);
      return topic;
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role()
  @Put(':id/star')
  public async starTopic(@Request() req, @Param('id') id: string) {
    const { email } = req.user;

    try {
      await this.topics.starTopic(email, id);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role()
  @Put(':id/collect')
  public async collectTopic(@Request() req, @Param('id') id: string) {
    const { email } = req.user;

    try {
      await this.topics.collectTopic(email, id);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role()
  @Post(':id/comment')
  public async createComment(
    @Request() req,
    @Param('id') id: string,
    @Body() data: CreateCommentDTO,
  ) {
    const { email } = req.user;
    const { content } = data;

    try {
      const commentId = await this.topics.createComment(email, id, content);
      return { commentId };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
