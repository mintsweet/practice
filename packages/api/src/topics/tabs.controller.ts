import {
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Body,
  Param,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { Role, Public } from '@auth';

import { TopicsService } from './topics.service';
import { CreateTabDTO, UpdateTabDTO } from './dtos';

@Controller('tabs')
export class TabsController {
  constructor(private topics: TopicsService) {}

  @Role(10)
  @Post('')
  public async create(@Body() data: CreateTabDTO) {
    const { sign, summary } = data;

    try {
      await this.topics.createTab(sign, summary);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role(10)
  @Delete(':id')
  public async delete(@Param('id') id: string) {
    try {
      await this.topics.deleteTab(id);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Role(10)
  @Put(':id')
  public async update(@Param('id') id: string, @Body() data: UpdateTabDTO) {
    try {
      await this.topics.updateTab(id, data);
      return { success: true };
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }

  @Public()
  @Get('')
  public async query() {
    try {
      const tabs = await this.topics.getTabs();
      return tabs;
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
