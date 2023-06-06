import { Module } from '@nestjs/common';

import { AuthModule } from '@auth';

import * as Controllers from './controllers';

@Module({
  imports: [AuthModule],
  controllers: Object.values(Controllers),
})
export class BaseModule {}
