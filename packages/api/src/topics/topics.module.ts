import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tab } from '@entities';

import * as Controllers from './controllers';
import { TopicsService } from './topics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tab]), ConfigModule, JwtModule],
  controllers: Object.values(Controllers),
  providers: [TopicsService],
})
export class TopicsModule {}
