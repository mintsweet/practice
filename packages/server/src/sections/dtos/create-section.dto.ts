import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
