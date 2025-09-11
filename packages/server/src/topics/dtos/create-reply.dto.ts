import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReplyDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  parentReplyId?: string;
}
