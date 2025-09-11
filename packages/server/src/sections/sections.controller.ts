import {
  Controller,
  Post,
  Delete,
  Patch,
  Get,
  Param,
  Body,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@/auth/auth.guard';
import { RequireRole } from '@/common/decorators';
import { CustomError } from '@/common/error';

import { CreateSectionDTO } from './dtos';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sections: SectionsService) {}

  private errorHandle(err) {
    if (err instanceof CustomError) {
      switch (err.code) {
        default:
          throw new BadRequestException();
      }
    }

    throw new InternalServerErrorException('Something Error.');
  }

  @Post()
  @UseGuards(AuthGuard)
  @RequireRole(100)
  public async create(@Body() payload: CreateSectionDTO) {
    try {
      const sectionId = await this.sections.create(payload);
      return sectionId;
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @RequireRole(100)
  public async remove(@Param('id') id: string) {
    try {
      await this.sections.remove(id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @RequireRole(100)
  public async update(
    @Param('id') id: string,
    @Body() payload: { description: string },
  ) {
    try {
      await this.sections.update(id, payload.description);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Get()
  public async query() {
    try {
      const sections = await this.sections.query();
      return sections;
    } catch (err) {
      this.errorHandle(err);
    }
  }
}
