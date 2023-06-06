import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '@auth';

import * as Controllers from './controllers';

@Module({
  imports: [ConfigModule, JwtModule, AuthModule],
  controllers: Object.values(Controllers),
})
export class BaseModule {}
