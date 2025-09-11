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
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/auth.guard';
import { RequireRole } from '@/common/decorators';
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

  @Post()
  @UseGuards(AuthGuard)
  @RequireRole(10)
  public async create(@Body() payload: CreateTagDTO) {
    try {
      const tagId = await this.tag.create(payload);
      return tagId;
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @RequireRole(10)
  public async remove(@Param('id') id: string) {
    try {
      await this.tag.remove(id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @RequireRole(10)
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
