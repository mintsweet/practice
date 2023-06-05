import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genSaltSync, hashSync } from 'bcrypt';

import { UsersService } from '@users';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService, private users: UsersService) {}

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(+this.config.get('SALT_ROUNDS')));
  }

  public async signup(email: string, password: string, nickname: string) {
    const existEmail = await this.users.exist({ where: { email } });

    if (existEmail) {
      throw new Error(`The email of ${email} already exists.`);
    }

    const existNickname = await this.users.exist({ where: { nickname } });

    if (existNickname) {
      throw new Error(`The nickname of ${nickname} already exists.`);
    }

    const hashPassword = this.hashPassword(password);

    const user = await this.users.create({
      email,
      password: hashPassword,
      nickname,
    });

    return user.id;
  }
}
