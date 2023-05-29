import { Module } from '@nestjs/common';

import { CommonController } from './common.controller';

@Module({
  controllers: [CommonController],
})
export class CommonModule {}
