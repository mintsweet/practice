import { IsOptional, Length, MaxLength } from 'class-validator';

export class UpdateTopicDTO {
  @IsOptional()
  tab: string;

  @IsOptional()
  @Length(6, 20)
  title: string;

  @IsOptional()
  @MaxLength(500)
  content: string;
}
