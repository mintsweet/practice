import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../src/entities/user.entity';

const { SALT_ROUNDS, ROOT_PASS } = process.env;

export class InitUserRoot1685428173986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = bcrypt.genSaltSync(+SALT_ROUNDS);
    const hash = bcrypt.hashSync(ROOT_PASS, salt);
    await queryRunner.manager.save(
      queryRunner.manager.create(User, {
        email: 'root@practice.com',
        password: hash,
        nickname: 'root',
        role: UserRole.ROOT,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'root@practice.com' });
  }
}
