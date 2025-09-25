import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DataBaseModule } from '@/db';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, DataBaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
