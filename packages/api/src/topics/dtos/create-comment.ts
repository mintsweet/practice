import { Length } from 'class-validator';

export class CreateCommentDTO {
  @Length(2, 30)
  content: string;
}
