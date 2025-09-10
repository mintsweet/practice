import { Module } from '@nestjs/common';

import { DataBaseModule } from '@/db';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [DataBaseModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
