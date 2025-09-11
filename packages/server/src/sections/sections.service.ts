import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { sections } from '@/db';

@Injectable()
export class SectionsService {
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
    const [section] = await this.db
      .insert(sections)
      .values({
        name,
        description,
      })
      .returning({
        id: sections.id,
      });

    return section.id;
  }

  public async remove(sectionId: string) {
    await this.db.delete(sections).where(eq(sections.id, sectionId));
  }

  public async update(sectionId: string, description: string) {
    await this.db
      .update(sections)
      .set({ description })
      .where(eq(sections.id, sectionId));
  }

  public query() {
    return this.db.select().from(sections);
  }
}
