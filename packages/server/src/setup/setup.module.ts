import { Module } from '@nestjs/common';

import { DataBaseModule } from '@/db';

import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  imports: [DataBaseModule],
  controllers: [SetupController],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
