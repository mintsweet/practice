import { Injectable, Inject } from '@nestjs/common';
import dayjs from 'dayjs';
import { sql, and, gte, eq, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import { CustomError } from '@/common/error';
import { topics, sections, users, topicTags } from '@/db';

import { TOPIC_ERROR_CODE } from './error-code';

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
        })
        .from(topics)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return [result, total];
    });
  }

  public async queryById(topicId: string) {
    return this.db.transaction(async (tx) => {
      const [topic] = await tx
        .select({
          id: topics.id,
          title: topics.title,
          content: topics.content,
          section: {
            id: sections.id,
            name: sections.name,
          },
          user: {
            id: users.id,
            nickname: users.nickname,
          },
        })
        .from(topics)
        .leftJoin(sections, eq(topics.sectionId, sections.id))
        .leftJoin(users, eq(topics.userId, users.id))
        .where(eq(topics.id, topicId));

      return topic;
    });
  }
}
