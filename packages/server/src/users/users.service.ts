import { Injectable, Inject } from '@nestjs/common';
import { eq, sql, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { CustomError } from '@/common/error';
import { users, userFollows } from '@/db';

import { USER_ERROR_CODE } from './error-code';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  public async queryById(userId: string, viewerId?: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        nickname: users.nickname,
        starred: users.starred,
        followersCount: users.followersCount,
        followingCount: users.followingCount,
        followed: userId
          ? sql<boolean>`exists(select 1 from ${userFollows} uf where uf.followee_id = ${userId} and uf.follower_id = ${viewerId})`
          : sql<boolean>`false`,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new CustomError(
        USER_ERROR_CODE.User_Not_Found,
        `User ${userId} cannot find`,
      );
    }

    return user;
  }

  public async follow(followerId: string, followeeId: string) {
    if (followeeId === followerId) {
      throw new CustomError(
        USER_ERROR_CODE.User_Cannot_Follow_Theirself,
        'You cannot follow yourself',
      );
    }

    return this.db.transaction(async (tx) => {
      await tx.insert(userFollows).values({
        followerId,
        followeeId,
      });

      await tx
        .update(users)
        .set({
          followingCount: sql`${users.followingCount} + 1`,
        })
        .where(eq(users.id, followerId));

      await tx
        .update(users)
        .set({
          followersCount: sql`${users.followersCount} + 1`,
        })
        .where(eq(users.id, followeeId));
    });
  }

  public async unfollow(followerId: string, followeeId: string) {
    return this.db.transaction(async (tx) => {
      await tx
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, followerId),
            eq(userFollows.followeeId, followeeId),
          ),
        );

      await tx
        .update(users)
        .set({
          followingCount: sql`${users.followingCount} - 1`,
        })
        .where(eq(users.id, followerId));

      await tx
        .update(users)
        .set({
          followersCount: sql`${users.followersCount} - 1`,
        })
        .where(eq(users.id, followeeId));
    });
  }
}
