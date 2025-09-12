import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DataBaseModule } from '@/db';

import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  imports: [AuthModule, DataBaseModule],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
