import {
  Controller,
  Post,
  Delete,
  Patch,
  Get,
  Body,
  Param,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Auth } from '@/auth/auth.decorator';
import { CustomError } from '@/common/error';

import { CreateTagDTO } from './dtos';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tag: TagsService) {}

  private errorHandle(err) {
    if (err instanceof CustomError) {
      switch (err.code) {
        default:
          throw new BadRequestException(err.message);
      }
    }

    throw new InternalServerErrorException(err.message);
  }

  @Auth(10)
  @Post()
  public async create(@Body() payload: CreateTagDTO) {
    try {
      const tagId = await this.tag.create(payload);
      return tagId;
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth(10)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    try {
      await this.tag.remove(id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth(10)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() payload: { description: string },
  ) {
    try {
      await this.tag.update(id, payload.description);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Get()
  public async query() {
    try {
      const tags = await this.tag.query();
      return tags;
    } catch (err) {
      this.errorHandle(err);
    }
  }
}
