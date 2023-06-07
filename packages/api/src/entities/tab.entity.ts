import { Entity, Column } from 'typeorm';

import { Base } from './base.entity';

@Entity()
export class Tab extends Base {
  @Column({ unique: true })
  sign: string;

  @Column({ default: '' })
  summary: string;

  @Column({ name: 'is_delete', default: false })
  isDelete: boolean;
}
