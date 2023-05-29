import { Module } from '@nestjs/common';

import { TopicsController } from './topics.controller';

@Module({
  controllers: [TopicsController],
})
export class TopicsModule {}
