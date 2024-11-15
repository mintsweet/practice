import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tab, Topic, User, Comment } from '@/entities';

import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tab, Topic, User, Comment]),
    ConfigModule,
    JwtModule,
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
