import { Length, MaxLength } from 'class-validator';

export class CreateTopicDTO {
  tab: string;

  @Length(6, 20)
  title: string;

  @MaxLength(500)
  content: string;
}
