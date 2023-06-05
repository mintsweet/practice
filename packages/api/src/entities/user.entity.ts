import { Entity, Column, Index } from 'typeorm';

import { Base } from './base.entity';

export enum UserRole {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends Base {
  @Column({ unique: true })
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ default: '' })
  signature: string;

  @Column({ default: 0 })
  score: number;

  @Column({ name: 'is_star', default: false })
  isStar: boolean;

  @Column({ name: 'is_lock', default: false })
  isLock: boolean;

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean;

  @Column({ name: 'topic_count', default: 0 })
  topicCount: number;

  @Column({ name: 'star_count', default: 0 })
  starCount: number;

  @Column({ name: 'collect_count', default: 0 })
  collectCount: number;

  @Column({ name: 'follower_count', default: 0 })
  followerCount!: number;

  @Column({ name: 'following_count', default: 0 })
  followingCount!: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
