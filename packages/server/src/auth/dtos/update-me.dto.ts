import { IsOptional, Length } from 'class-validator';

export class UpdateMeDTO {
  @IsOptional()
  @Length(2, 10)
  nickname: string;
}
