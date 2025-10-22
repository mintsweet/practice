import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DATABASE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const DB_HOST = config.get('DB_HOST') || 'localhost';
        const DB_USER = config.get('DB_USER');
        const DB_PASSWORD = config.get('DB_PASSWORD');
        const DB_NAME = config.get('DB_NAME');
        const DB_PORT = config.get('DB_PORT');

        const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

        const pool = new Pool({ connectionString });
        return drizzle({ client: pool, casing: 'camelCase' });
      },
    },
  ],
  exports: ['DATABASE'],
})
export class DataBaseModule {}
