import { IsEmail, MinLength, Length } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @Length(2, 10)
  nickname: string;
}
