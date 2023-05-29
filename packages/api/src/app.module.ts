import { Module } from '@nestjs/common';

import { CommonModule } from './common';
import { NoticesModule } from './notices';
import { TopicsModule } from './topics';
import { UsersModule } from './users';

@Module({
  imports: [CommonModule, NoticesModule, TopicsModule, UsersModule],
})
export class AppModule {}
