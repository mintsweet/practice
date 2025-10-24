import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested, IsEmail } from 'class-validator';

class RootUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;
}

class SectionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

class TagDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class InitializeDto {
  @ValidateNested()
  @Type(() => RootUserDto)
  root: RootUserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];
}
