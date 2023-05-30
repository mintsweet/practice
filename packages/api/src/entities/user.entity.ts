import { Entity, Column, Index } from 'typeorm';

import { Base } from './base.entity';

export enum UserRole {
  ROOT = 'root',
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends Base {
  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  nickname!: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ default: 0 })
  score!: number;

  @Column({ default: false })
  is_star!: boolean;

  @Column({ default: false })
  is_lock!: boolean;

  @Column({ default: false })
  is_delete!: boolean;

  @Column({ default: 0 })
  topic_count!: number;

  @Column({ default: 0 })
  star_count!: number;

  @Column({ default: 0 })
  collect_count!: number;

  @Column({ default: 0 })
  follower_count!: number;

  @Column({ default: 0 })
  following_count!: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;
}
