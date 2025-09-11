import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { tags } from '@/db';

@Injectable()
export class TagsService {
  constructor(
    @Inject('DATABASE') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  public async create({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) {
    const [tag] = await this.db
      .insert(tags)
      .values({
        name,
        description,
      })
      .returning({
        id: tags.id,
      });

    return tag.id;
  }

  public async remove(tagId: string) {
    await this.db.delete(tags).where(eq(tags.id, tagId));
  }

  public async update(tagId: string, description: string) {
    await this.db.update(tags).set({ description }).where(eq(tags.id, tagId));
  }

  public query() {
    return this.db.select().from(tags);
  }
}
