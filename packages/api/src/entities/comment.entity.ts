import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Base } from './base.entity';
import { Topic } from './topic.entity';
import { User } from './user.entity';

@Entity()
export class Comment extends Base {
  @Column()
  content: string;

  @ManyToOne(() => Topic)
  @JoinColumn()
  topic: Topic;

  @OneToOne(() => User)
  @JoinColumn()
  author: User;
}
