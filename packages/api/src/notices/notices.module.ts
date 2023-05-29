import { Module } from '@nestjs/common';

import { NoticesController } from './notices.controller';

@Module({
  controllers: [NoticesController],
})
export class NoticesModule {}
