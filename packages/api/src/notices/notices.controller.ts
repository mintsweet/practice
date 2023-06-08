import {
  Controller,
  Query,
  Get,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { QueryDTO } from './dtos';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private readonly notices: NoticesService) {}

  @Get('')
  public async query(@Query() query: QueryDTO) {
    const { type } = query;

    try {
      const notices = await this.notices.getNotices(type);
      return notices;
    } catch (err) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
      });
    }
  }
}
