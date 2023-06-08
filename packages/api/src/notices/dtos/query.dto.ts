import { IsOptional, IsEnum } from 'class-validator';

import { NoticeType } from '@common/constants';

export class QueryDTO {
  @IsOptional()
  @IsEnum(NoticeType)
  type: NoticeType;
}
