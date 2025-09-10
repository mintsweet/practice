import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { users } from '@/db';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE') private readonly db) {}

  private selectO = {
    email: users.email,
    nickname: users.nickname,
    score: users.score,
    starred: users.starred,
  };

  public async findById(id: string) {
    const [user] = await this.db
      .select(this.selectO)
      .from(users)
      .where(eq(users.id, id));
    return user ?? null;
  }

  public async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user ?? null;
  }

  public async findByNickname(nickname: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.nickname, nickname));
    return user ?? null;
  }

  public async create(data: {
    email: string;
    password: string;
    nickname: string;
  }) {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  public async update(userId: string, payload: { nickname?: string }) {
    const [updatedUser] = await this.db
      .update(users)
      .set(payload)
      .where(eq(users.id, userId))
      .returning(this.selectO);
    return updatedUser;
  }
}
