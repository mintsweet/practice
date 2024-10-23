import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from '@auth';

import { BaseModule } from './base';
import { TopicsModule } from './topics';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.ENV ?? 'local'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (service: ConfigService) => ({
        type: 'postgres',
        host: service.get('DB_HOST'),
        port: +service.get('DB_PORT'),
        database: service.get('DB_NAME'),
        username: service.get('DB_USERNAME'),
        password: service.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: service.get('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    JwtModule,
    BaseModule,
    TopicsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
