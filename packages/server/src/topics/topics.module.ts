import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DataBaseModule } from '@/db';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [AuthModule, DataBaseModule],
  providers: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
