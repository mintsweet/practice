import { Injectable, Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import { sql, and, gte, eq, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { CustomError } from '@/common/error';
import {
  topics,
  sections,
  users,
  tags,
  topicTags,
  topicLikes,
  topicCollects,
  replies,
} from '@/db';

import { TOPIC_ERROR_CODE } from './error-code';

type ReactionType = 'like' | 'collect';

@Injectable()
export class TopicsService {
  constructor(
    @Inject('DATABASE') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  public async create({
    title,
    content,
    sectionId,
    userId,
    tagIds,
  }: {
    title: string;
    content: string;
    sectionId: string;
    userId: string;
    tagIds?: string[];
  }) {
    return this.db.transaction(async (tx) => {
      const [topic] = await tx
        .insert(topics)
        .values({
          title,
          content,
          sectionId,
          userId,
        })
        .returning({ id: topics.id });

      const [user] = await tx
        .update(users)
        .set({ score: sql`${users.score} - 10` })
        .where(and(eq(users.id, userId), gte(users.score, 10)))
        .returning();

      if (!user) {
        throw new CustomError(
          TOPIC_ERROR_CODE.Topic_Score_Insufficient,
          "The user's score is insufficient and cannot create a topic",
        );
      }

      if (tagIds?.length) {
        await tx.insert(topicTags).values(
          tagIds.map((tagId) => ({
            topicId: topic.id,
            tagId,
          })),
        );
      }

      return topic.id;
    });
  }

  public async remove(topicId: string, userId: string) {
    const [topic] = await this.db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!topic) {
      throw new CustomError(
        TOPIC_ERROR_CODE.Topic_Not_Found,
        `Topic ${topicId} not found`,
      );
    }

    if (topic.userId !== userId) {
      throw new CustomError(
        TOPIC_ERROR_CODE.Topic_Forbidden,
        `User ${userId} cannot delete this topic`,
      );
    }

    const diffMinutes = dayjs().diff(dayjs(topic.createdAt), 'minute');
    if (diffMinutes > 3) {
      throw new CustomError(
        TOPIC_ERROR_CODE.Topic_Score_Insufficient,
        `Topic ${topicId} cannot be deleted after 3 minutes`,
      );
    }

    await this.db
      .update(topics)
      .set({ deleted: true })
      .where(eq(topics.id, topicId));
  }

  public async update(
    topicId: string,
    userId: string,
    { content, tagIds }: { content: string; tagIds: string[] },
  ) {
    const [topic] = await this.db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!topic) {
      throw new CustomError(
        TOPIC_ERROR_CODE.Topic_Not_Found,
        `Topic ${topicId} not found`,
      );
    }

    if (topic.userId !== userId) {
      throw new CustomError(
        TOPIC_ERROR_CODE.Topic_Forbidden,
        `User ${userId} cannot update this topic`,
      );
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(topics)
        .set({ content, updatedAt: dayjs().toDate() })
        .where(eq(topics.id, topicId));

      await tx.delete(topicTags).where(eq(topicTags.topicId, topicId));

      if (tagIds && tagIds.length > 0) {
        await tx.insert(topicTags).values(
          tagIds.map((tagId) => ({
            topicId,
            tagId,
          })),
        );
      }
    });
  }

  public async query({ page, pageSize }: { page: number; pageSize: number }) {
    return this.db.transaction(async (tx) => {
      const [{ total }] = await tx.select({ total: count() }).from(topics);

      const result = await tx
        .select({
          id: topics.id,
          title: topics.title,
          content: topics.content,
          visitCount: topics.visitCount,
          likeCount: topics.likeCount,
          collectCount: topics.collectCount,
          replyCount: topics.replyCount,
          createdAt: topics.createdAt,
          section: {
            id: sections.id,
            name: sections.name,
          },
          author: {
            id: users.id,
            nickname: users.nickname,
          },
          tags: sql`coalesce(array_agg(distinct ${tags.name}), '{}')`.as(
            'tags',
          ),
        })
        .from(topics)
        .leftJoin(sections, eq(topics.sectionId, sections.id))
        .leftJoin(users, eq(topics.userId, users.id))
        .leftJoin(topicTags, eq(topicTags.topicId, topics.id))
        .leftJoin(tags, eq(topicTags.tagId, tags.id))
        .groupBy(topics.id, sections.id, users.id)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return [result, total];
    });
  }

  public async queryById(topicId: string, userId?: string) {
    return this.db.transaction(async (tx) => {
      const [topic] = await tx
        .select({
          id: topics.id,
          title: topics.title,
          content: topics.content,
          visitCount: topics.visitCount,
          likeCount: topics.likeCount,
          collectCount: topics.collectCount,
          replyCount: topics.replyCount,
          createdAt: topics.createdAt,
          section: {
            id: sections.id,
            name: sections.name,
          },
          author: {
            id: users.id,
            nickname: users.nickname,
          },
          tags: sql`coalesce(array_agg(distinct ${tags.name}), '{}')`.as(
            'tags',
          ),
          liked: userId
            ? sql<boolean>`exists(select 1 from ${topicLikes} tl where tl.topic_id = ${topics.id} and tl.user_id = ${userId})`
            : sql<boolean>`false`,
          collected: userId
            ? sql<boolean>`exists(select 1 from ${topicCollects} tc where tc.topic_id = ${topics.id} and tc.user_id = ${userId})`
            : sql<boolean>`false`,
        })
        .from(topics)
        .leftJoin(sections, eq(topics.sectionId, sections.id))
        .leftJoin(users, eq(topics.userId, users.id))
        .leftJoin(topicTags, eq(topicTags.topicId, topics.id))
        .leftJoin(tags, eq(topicTags.tagId, tags.id))
        .groupBy(topics.id, sections.id, users.id)
        .where(eq(topics.id, topicId));

      const replys = await tx
        .select({
          id: replies.id,
          content: replies.content,
          createdAt: replies.createdAt,
          author: {
            id: users.id,
            nickname: users.nickname,
          },
        })
        .from(replies)
        .leftJoin(users, eq(replies.userId, users.id))
        .where(eq(replies.topicId, topicId))
        .orderBy(replies.createdAt);

      return {
        ...topic,
        replys,
      };
    });
  }

  public async addLike(topicId: string, userId: string) {
    return this.setReaction(topicId, userId, 'like');
  }

  public async removeLike(topicId: string, userId: string) {
    return this.clearReaction(topicId, userId, 'like');
  }

  public async addCollect(topicId: string, userId: string) {
    return this.setReaction(topicId, userId, 'collect');
  }

  public async removeCollect(topicId: string, userId: string) {
    return this.clearReaction(topicId, userId, 'collect');
  }

  private readonly reactionConfig = {
    like: {
      counterColumn: 'likeCount',
      relationTable: topicLikes,
      scoreChange: {
        actor: -3,
        owner: +3,
      },
    },
    collect: {
      counterColumn: 'collectCount',
      relationTable: topicCollects,
      scoreChange: {
        actor: -5,
        owner: +5,
      },
    },
  };

  private async setReaction(
    topicId: string,
    userId: string,
    type: ReactionType,
  ) {
    const config = this.reactionConfig[type];

    await this.db.transaction(async (tx) => {
      const [topic] = await tx
        .select({ id: topics.id, userId: topics.userId })
        .from(topics)
        .where(eq(topics.id, topicId));

      if (!topic)
        throw new CustomError(
          TOPIC_ERROR_CODE.Topic_Not_Found,
          `Topic ${topicId} not found`,
        );

      await tx
        .update(topics)
        .set({
          [config.counterColumn]: sql`${topics[config.counterColumn]} + 1`,
        })
        .where(eq(topics.id, topicId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + ${config.scoreChange.actor}`,
        })
        .where(eq(users.id, userId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + ${config.scoreChange.owner}`,
        })
        .where(eq(users.id, topic.userId));

      await tx.insert(config.relationTable).values({
        topicId: topic.id,
        userId,
      });
    });
  }

  private async clearReaction(
    topicId: string,
    userId: string,
    type: ReactionType,
  ) {
    const config = this.reactionConfig[type];

    await this.db.transaction(async (tx) => {
      const [topic] = await tx
        .select({ id: topics.id, userId: topics.userId })
        .from(topics)
        .where(eq(topics.id, topicId));

      if (!topic)
        throw new CustomError(
          TOPIC_ERROR_CODE.Topic_Not_Found,
          `Topic ${topicId} not found`,
        );

      await tx
        .update(topics)
        .set({
          [config.counterColumn]: sql`${topics[config.counterColumn]} - 1`,
        })
        .where(eq(topics.id, topicId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + ${config.scoreChange.actor}`,
        })
        .where(eq(users.id, userId));

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + ${config.scoreChange.owner}`,
        })
        .where(eq(users.id, topic.userId));

      await tx
        .delete(config.relationTable)
        .where(
          and(
            eq(config.relationTable.topicId, topic.id),
            eq(config.relationTable.userId, userId),
          ),
        );
    });
  }

  public async reply(
    topicId: string,
    userId: string,
    { content, parentReplyId }: { content: string; parentReplyId?: string },
  ) {
    return this.db.transaction(async (tx) => {
      const [reply] = await tx
        .insert(replies)
        .values({
          topicId,
          userId,
          content,
          parentReplyId,
        })
        .returning({
          id: replies.id,
        });

      await tx.update(topics).set({
        lastReplyAt: dayjs().toDate(),
        lastReplyId: reply.id,
        updatedAt: dayjs().toDate(),
      });
      return reply.id;
    });
  }
}
