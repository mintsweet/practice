import { Module } from '@nestjs/common';

import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
