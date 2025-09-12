import { Injectable, Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import { eq, sql, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { CustomError } from '@/common/error';
import { replies, replyLikes, users } from '@/db';

import { REPLY_ERROR_CODE } from './error-code';

@Injectable()
export class RepliesService {
  constructor(
    @Inject('DATABASE') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  public async update(replyId: string, userId: string, content: string) {
    const [reply] = await this.db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (!reply) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Not_Found,
        `Reply ${reply} not found`,
      );
    }

    if (reply.userId !== userId) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Forbidden,
        `User ${userId} cannot edit this reply`,
      );
    }

    await this.db
      .update(replies)
      .set({
        content,
        edited: true,
        updatedAt: dayjs().toDate(),
      })
      .where(eq(replies.id, replyId));
  }

  public async remove(replyId: string, userId: string) {
    const [reply] = await this.db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (!reply) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Not_Found,
        `Reply ${reply} not found`,
      );
    }

    if (reply.userId !== userId) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Forbidden,
        `User ${userId} cannot edit this reply`,
      );
    }

    await this.db
      .update(replies)
      .set({
        deleted: true,
        updatedAt: dayjs().toDate(),
      })
      .where(eq(replies.id, replyId));
  }

  public async addLike(replyId: string, userId: string) {
    const [reply] = await this.db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (!reply) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Not_Found,
        `Reply ${reply} not found`,
      );
    }

    await this.db.transaction(async (tx) => {
      await tx.insert(replyLikes).values({
        replyId,
        userId,
      });

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + 1`,
        })
        .where(eq(replies.userId, reply.userId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} - 1`,
        })
        .where(eq(replies.userId, userId));
    });
  }

  public async removeLike(replyId: string, userId: string) {
    const [reply] = await this.db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (!reply) {
      throw new CustomError(
        REPLY_ERROR_CODE.Reply_Not_Found,
        `Reply ${reply} not found`,
      );
    }

    await this.db.transaction(async (tx) => {
      await tx
        .delete(replyLikes)
        .where(
          and(eq(replyLikes.replyId, replyId), eq(replyLikes.userId, userId)),
        );

      await tx
        .update(users)
        .set({
          score: sql`${users.score} - 1`,
        })
        .where(eq(replies.userId, reply.userId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + 1`,
        })
        .where(eq(replies.userId, userId));
    });
  }
}
