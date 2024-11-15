import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tab, Topic, User, Comment } from '@entities';

import { TabsController } from './tabs.controller';
import { TabsService } from './tabs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tab, Topic, User, Comment]),
    ConfigModule,
    JwtModule,
  ],
  controllers: [TabsController],
  providers: [TabsService],
})
export class TabsModule {}
