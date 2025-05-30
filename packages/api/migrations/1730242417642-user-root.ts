import { genSaltSync, hashSync } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { User } from '../src/entities';

const { SALT_ROUNDS, ROOT_PASS } = process.env;

export class UserRoot1730242417642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create(User, {
        email: 'root@practice.com',
        password: hashSync(ROOT_PASS, genSaltSync(+SALT_ROUNDS)),
        nickname: 'root',
        role: 101,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'root@practice.com' });
  }
}
