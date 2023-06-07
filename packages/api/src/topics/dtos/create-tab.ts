import { Length, IsOptional, MaxLength } from 'class-validator';

export class CreateTabDTO {
  @Length(2, 10)
  sign: string;

  @IsOptional()
  @MaxLength(50)
  summary: string;
}
