import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notice } from '@entities';
import { NoticeType } from '@common/constants';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice) private readonly notice: Repository<Notice>,
  ) {}

  public async getNotices(type: NoticeType) {
    return this.notice.find({ where: { type } });
  }
}
