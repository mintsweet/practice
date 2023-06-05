import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
