import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

import { UsersService } from '@/users';

import { IProfile } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private users: UsersService,
  ) {}

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(+this.config.get('SALT_ROUNDS')));
  }

  private comparePassword(password: string, hash: string) {
    return compareSync(password, hash);
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

  public async signin(email: string, password: string) {
    const user = await this.users.findOne(email);

    if (!user) {
      throw new Error('Email or password is incorrect.');
    }

    const match = this.comparePassword(password, user.password);

    if (!match) {
      throw new Error('Email or password is incorrect.');
    }

    return this.jwt.sign({ email });
  }

  public async getProfile(email: string) {
    return this.users.getProfile(email);
  }

  public async updateProfile(
    email: string,
    { nickname, signature, oldPass, newPass }: IProfile,
  ) {
    const user = await this.users.findOne(email);

    if (nickname) {
      const exist = await this.users.exist({ where: { nickname } });
      if (exist) {
        throw new Error(`The nickname of ${nickname} already exists.`);
      }
    }

    let hashPassword = user.password;

    if (oldPass && newPass) {
      const match = this.comparePassword(oldPass, hashPassword);

      if (!match) {
        throw new Error('Old password is incorrect.');
      }

      hashPassword = this.hashPassword(newPass);
    }

    await this.users.update(email, {
      nickname,
      signature,
      password: hashPassword,
    });
  }
}
