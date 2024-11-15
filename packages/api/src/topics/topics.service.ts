import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Tab, Topic, Comment, User } from '@/entities';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Tab) private readonly tab: Repository<Tab>,
    @InjectRepository(Topic) private readonly topic: Repository<Topic>,
    @InjectRepository(Comment) private readonly comment: Repository<Comment>,
    @InjectRepository(User) private readonly user: Repository<User>,
    private dataSource: DataSource,
  ) {}

  public async createTab(sign: string, summary: string) {
    const exist = await this.tab.exist({ where: { sign } });

    if (exist) {
      throw new Error(`The tab ${sign} already exists`);
    }

    const tab = await this.tab.save({ sign, summary });

    return tab.id;
  }

  public async deleteTab(id: string) {
    return this.tab.update({ id }, { isDelete: true });
  }

  public async updateTab(
    id: string,
    { sign, summary }: { sign?: string; summary?: string },
  ) {
    if (sign) {
      const exist = await this.tab.exist({ where: { sign } });

      if (exist) {
        throw new Error(`The tab ${sign} already exists`);
      }
    }

    return this.tab.update({ id }, { sign, summary });
  }

  public async getTabs() {
    return this.tab.find({ select: ['sign', 'summary'] });
  }

  public async createTopic(email: string, sign: string, title, content) {
    const tab = await this.tab.findOneBy({ sign });
    const author = await this.user.findOneBy({ email });
    const topic = await this.topic.save({ tab, title, content, author });
    return topic.id;
  }

  public async deleteTopic(id: string) {
    return this.topic.update({ id }, { isDelete: true });
  }

  public async updateTopic(
    id: string,
    { title, content }: { title?: string; content?: string },
  ) {
    return this.topic.update({ id }, { title, content });
  }

  public async getTopics(page = 1, pageSize = 10) {
    const [items, total] = await this.topic.findAndCount({
      skip: page - 1,
      take: pageSize,
      relations: { tab: true, author: true },
      select: {
        id: true,
        title: true,
        content: true,
        isTop: true,
        isGood: true,
        viewCount: true,
        starCount: true,
        collectCount: true,
        tab: {
          sign: true,
          summary: true,
        },
        author: {
          nickname: true,
        },
      },
    });
    return {
      items,
      total,
    };
  }

  public async getTopic(id: string) {
    return this.topic.findOne({
      where: { id },
      relations: { tab: true, author: true, comments: true },
      select: {
        id: true,
        title: true,
        content: true,
        isTop: true,
        isGood: true,
        viewCount: true,
        starCount: true,
        collectCount: true,
        commentCount: true,
        tab: {
          sign: true,
          summary: true,
        },
        author: {
          nickname: true,
        },
        comments: {
          content: true,
          createdAt: true,
        },
      },
    });
  }

  public async starTopic(email: string, topicId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.topic.update(
        { id: topicId },
        {
          starCount: () => 'star_count + 1',
        },
      );
      await this.user.update(
        { email },
        {
          starCount: () => 'star_count + 1',
        },
      );
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public async collectTopic(email: string, topicId: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.topic.update(
        { id: topicId },
        { collectCount: () => 'collect_count + 1' },
      );
      await this.user.update(
        { email },
        { collectCount: () => 'collect_count + 1' },
      );
      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public async createComment(email: string, topicId: string, content: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const topic = await this.topic.findOneBy({ id: topicId });
      const author = await this.user.findOneBy({ email });
      const comment = await this.comment.save({ content, topic, author });

      await queryRunner.commitTransaction();

      return comment.id;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
