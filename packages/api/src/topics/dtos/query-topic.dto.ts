import { IsNumber, IsOptional } from 'class-validator';

export class QueryTopicDTO {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  pageSize: number;
}
