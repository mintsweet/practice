import { MigrationInterface, QueryRunner } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

import { User, UserRole } from '../src/entities/user.entity';

const { SALT_ROUNDS, ROOT_PASS } = process.env;

export class InitUserRoot1685428173986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create(User, {
        email: 'root@practice.com',
        password: hashSync(ROOT_PASS, genSaltSync(+SALT_ROUNDS)),
        nickname: 'root',
        role: UserRole.ROOT,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'root@practice.com' });
  }
}
