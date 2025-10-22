import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  hello() {
    return {
      message: `${this.config.get('APP_NAME')} API is running!`,
    };
  }

  @Get('/health')
  health() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
