import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common';
import { NoticesModule } from './notices';
import { TopicsModule } from './topics';
import { UsersModule } from './users';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'practice',
      autoLoadEntities: true,
    }),
    CommonModule,
    NoticesModule,
    TopicsModule,
    UsersModule,
  ],
})
export class AppModule {}
