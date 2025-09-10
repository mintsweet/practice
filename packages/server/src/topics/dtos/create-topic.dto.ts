import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTopicDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  sectionId: string;
}
