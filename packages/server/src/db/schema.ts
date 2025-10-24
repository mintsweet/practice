import {
  pgTable as table,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  index,
  text,
  primaryKey,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

export const users = table(
  'users',
  {
    id: uuid().defaultRandom().primaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    nickname: varchar({ length: 255 }).notNull().unique(),
    score: integer().notNull().default(100),
    starred: boolean().notNull().default(false),
    locked: boolean().notNull().default(false),
    deleted: boolean().notNull().default(false),
    role: integer().notNull().default(1),
    followersCount: integer().notNull().default(0),
    followingCount: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [uniqueIndex('email_idx').on(table.email)],
);

export const refreshTokens = table(
  'refresh_tokens',
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('refresh_tokens_user_idx').on(table.userId)],
);

export const userFollows = table(
  'user_follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followeeId: uuid('followee_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followeeId] }),
    index('user_follow_follower_idx').on(table.followerId),
    index('user_follow_followee_idx').on(table.followeeId),
  ],
);

export const sections = table('sections', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const topics = table(
  'topics',
  {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    sectionId: uuid('section_id')
      .notNull()
      .references(() => sections.id, { onDelete: 'cascade' }),

    pinned: boolean().default(false).notNull(),
    featured: boolean().default(false).notNull(),
    locked: boolean().default(false).notNull(),
    deleted: boolean().default(false).notNull(),

    visitCount: integer('visit_count').default(0).notNull(),
    likeCount: integer('like_count').default(0).notNull(),
    collectCount: integer('collect_count').default(0).notNull(),
    replyCount: integer('reply_count').default(0).notNull(),

    lastReplyId: uuid('last_reply_id').references(() => replies.id),
    lastReplyAt: timestamp('last_reply_at'),

    ...timestamps,
  },
  (table) => [
    index('topics_section_lastreply_idx').on(table.sectionId, table.updatedAt),
    index('topics_featured_idx').on(table.featured, table.updatedAt),
  ],
);

export const tags = table('tags', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
  description: varchar({ length: 255 }),
  ...timestamps,
});

export const topicTags = table(
  'topic_tags',
  {
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.topicId, table.tagId] }),
    index('topic_tags_tag_idx').on(table.tagId),
  ],
);

export const topicLikes = table(
  'topic_likes',
  {
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.topicId, table.userId] }),
    index('topic_likes_user_idx').on(table.userId),
  ],
);

export const topicCollects = table(
  'topic_collects',
  {
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.topicId, table.userId] }),
    index('topic_collects_user_idx').on(table.userId),
  ],
);

export const replies = table(
  'replies',
  {
    id: uuid().defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    parentReplyId: uuid('parent_reply_id').references(() => replies.id, {
      onDelete: 'cascade',
    }),

    content: text('content').notNull(),

    deleted: boolean().default(false).notNull(),
    edited: boolean().default(false).notNull(),

    ...timestamps,
  },
  (table) => [
    index('replies_topic_idx').on(table.topicId),
    index('replies_parent_idx').on(table.parentReplyId),
  ],
);

export const replyLikes = table(
  'reply_likes',
  {
    replyId: uuid('reply_id')
      .notNull()
      .references(() => replies.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.replyId, table.userId] }),
    index('reply_likes_user_idx').on(table.userId),
  ],
);

export const systemConfig = table('system_config', {
  id: uuid().defaultRandom().primaryKey(),
  key: varchar({ length: 100 }).notNull().unique(),
  value: text().notNull(),
  ...timestamps,
});
