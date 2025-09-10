import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class QueryTopicsDTO {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pageSize: number;
}
