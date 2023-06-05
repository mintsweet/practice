import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '@users';

import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
