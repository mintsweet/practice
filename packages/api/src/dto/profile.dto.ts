import {
  IsOptional,
  Length,
  IsString,
  MaxLength,
  ValidateIf,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ProfileDTO {
  @IsOptional()
  @Length(2, 10)
  nickname: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  signature: string;

  @ValidateIf((o) => o.newPass)
  @IsNotEmpty()
  @IsString()
  oldPass: string;

  @ValidateIf((o) => o.oldPass)
  @IsNotEmpty()
  @MinLength(6)
  newPass: string;
}
