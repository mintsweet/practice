import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hashSync, genSaltSync } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { sections, tags, systemConfig, users } from '@/db';

@Injectable()
export class SetupService {
  constructor(
    private readonly config: ConfigService,
    @Inject('DATABASE') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  private hash(text: string) {
    return hashSync(text, genSaltSync(+this.config.get('SALT_ROUNDS')));
  }

  async isInitialized(): Promise<boolean> {
    const [config] = await this.db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, 'initialized'));

    return config?.value === 'true';
  }

  async initialize(data: {
    root: { email: string; password: string; nickname: string };
    sections: Array<{ name: string; description: string }>;
    tags: Array<{ name: string; description: string }>;
  }) {
    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        ...data.root,
        password: this.hash(data.root.password),
        role: 101,
      });

      for (const section of data.sections) {
        await tx.insert(sections).values(section).onConflictDoNothing();
      }

      for (const tag of data.tags) {
        await tx.insert(tags).values(tag).onConflictDoNothing();
      }

      await tx.insert(systemConfig).values({
        key: 'initialized',
        value: 'true',
      });
    });
  }
}
