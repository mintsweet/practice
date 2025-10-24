import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';

import { InitializeDto } from './dtos';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get('status')
  async getStatus() {
    const initialized = await this.setupService.isInitialized();
    return { initialized };
  }

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  async initialize(@Body() dto: InitializeDto) {
    const initialized = await this.setupService.isInitialized();

    if (initialized) {
      throw new ForbiddenException(
        'System already initialized. Cannot initialize again.',
      );
    }

    await this.setupService.initialize(dto);

    return true;
  }
}
