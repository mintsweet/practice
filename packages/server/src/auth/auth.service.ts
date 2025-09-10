import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';

import { refreshTokens } from '@/db';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private jwt: JwtService,
    @Inject('DATABASE') private readonly db,
  ) {}

  private hash(text: string) {
    return hashSync(text, genSaltSync(+this.config.get('SALT_ROUNDS')));
  }

  private compareHash(text: string, hash: string) {
    return compareSync(text, hash);
  }

  public async signup(email: string, password: string, nickname: string) {
    const existEmail = await this.users.findByEmail(email);

    if (existEmail) {
      throw new Error(`The email of ${email} already exists.`);
    }

    const existNickname = await this.users.findByNickname(nickname);

    if (existNickname) {
      throw new Error(`The nickname of ${nickname} already exists.`);
    }

    const hashPassword = this.hash(password);

    const user = await this.users.create({
      email,
      password: hashPassword,
      nickname,
    });

    return user.id;
  }

  public async signin(email: string, password: string) {
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new Error('Email or password is incorrect.');
    }

    const match = this.compareHash(password, user.password);

    if (!match) {
      throw new Error('Email or password is incorrect.');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwt.signAsync(payload);

    const refreshTtl = parseInt(this.config.get('JWT_REFRESH_TTL') ?? '30', 10);
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: `${refreshTtl}d`,
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const tokenHash = this.hash(refreshToken);
    const expiresAt = dayjs().add(refreshTtl, 'd').toDate();

    const rows = await this.db
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
      })
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, user.id))
      .limit(1);

    const existing = rows[0];

    if (existing) {
      await this.db
        .update(refreshTokens)
        .set({ tokenHash, expiresAt })
        .where(eq(refreshTokens.userId, user.id));
    } else {
      await this.db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
      });
    }

    return { accessToken, refreshToken };
  }

  public async refresh(userId: string, refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    const tokens = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));

    let valid = false;
    for (const t of tokens) {
      if (dayjs(t.expiresAt).isBefore(dayjs())) continue;
      if (this.compareHash(refreshToken, t.tokenHash)) {
        valid = true;
        break;
      }
    }

    if (!valid) throw new Error('Invalid refresh token');

    const newAccessToken = await this.jwt.signAsync(
      { sub: userId, email: payload.email },
      { expiresIn: '1m' },
    );

    return { accessToken: newAccessToken };
  }

  public async signout(userId: string, refreshToken: string) {
    const tokens = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));

    for (const t of tokens) {
      if (this.compareHash(refreshToken, t.tokenHash)) {
        await this.db.delete(refreshTokens).where(eq(refreshTokens.id, t.id));
        return;
      }
    }
  }

  public getMe(userId: string) {
    return this.users.findById(userId);
  }

  public updateMe(userId: string, profile: { nickname?: string }) {
    return this.users.update(userId, profile);
  }
}
