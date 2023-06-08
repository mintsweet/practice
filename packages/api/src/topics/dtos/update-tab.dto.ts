import { IsOptional, Length, MaxLength } from 'class-validator';

export class UpdateTabDTO {
  @IsOptional()
  @Length(2, 10)
  sign: string;

  @IsOptional()
  @MaxLength(50)
  summary: string;
}
