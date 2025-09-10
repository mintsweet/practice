import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hashSync, genSaltSync } from 'bcryptjs';

import { users } from '@/db';

@Injectable()
export class AppService {
  constructor(
    @Inject('DATABASE') private readonly db,
    private config: ConfigService,
  ) {}

  private readonly logger = new Logger('Initialization');

  async onModuleInit() {
    const result = await this.db.select().from(users);

    if (result.length === 0) {
      await this.db.insert(users).values({
        email: 'root@practice.com',
        password: hashSync(
          this.config.get('ROOT_PASS'),
          genSaltSync(+this.config.get('SALT_ROUNDS')),
        ),
        nickname: 'root',
        role: 101,
      });
      this.logger.log('Super admin created');
    } else {
      this.logger.log('Super admin already exists, skipping initial');
    }
  }

  health() {
    return { status: 'OK' };
  }
}
