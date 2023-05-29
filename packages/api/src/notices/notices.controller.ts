import { Controller, Get } from '@nestjs/common';

@Controller('notices')
export class NoticesController {
  @Get('')
  query() {}
}
