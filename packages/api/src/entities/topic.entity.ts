import { Entity, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Tab } from './tab.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Topic extends Base {
  @OneToOne(() => Tab)
  @JoinColumn()
  tab: Tab;

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToOne(() => User)
  @JoinColumn()
  author: User;

  @Column({ name: 'is_top', default: false })
  isTop: boolean;

  @Column({ name: 'is_good', default: false })
  isGood: boolean;

  @Column({ name: 'is_lock', default: false })
  isLock: boolean;

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'star_count', default: 0 })
  starCount: number;

  @Column({ name: 'collect_count', default: 0 })
  collectCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @OneToMany(() => Comment, (comment) => comment.topic)
  comments: Comment;
}
