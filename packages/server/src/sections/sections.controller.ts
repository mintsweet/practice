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
} from '@nestjs/common';

import { Auth } from '@/auth/auth.decorator';
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

  @Auth(100)
  @Post()
  public async create(@Body() payload: CreateSectionDTO) {
    try {
      const sectionId = await this.sections.create(payload);
      return sectionId;
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth(100)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    try {
      await this.sections.remove(id);
      return { status: 'OK' };
    } catch (err) {
      this.errorHandle(err);
    }
  }

  @Auth(100)
  @Patch(':id')
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
