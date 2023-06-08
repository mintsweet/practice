import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { NoticeType } from '@common/constants';

import { Base } from './base.entity';
import { Topic } from './topic.entity';
import { User } from './user.entity';

@Entity()
export class Notice extends Base {
  @Column({
    type: 'enum',
    enumName: 'notice_type',
    enum: NoticeType,
  })
  type: NoticeType;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @OneToOne(() => User)
  @JoinColumn()
  receiver: User;

  @OneToOne(() => Topic)
  @JoinColumn()
  topic?: Topic;
}
