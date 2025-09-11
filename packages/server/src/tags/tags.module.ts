import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DataBaseModule } from '@/db';

import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [AuthModule, DataBaseModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
