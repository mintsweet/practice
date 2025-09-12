import { Module } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { DataBaseModule } from '@/db';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AppModule, DataBaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
