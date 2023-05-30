import { MigrationInterface, QueryRunner } from 'typeorm';

import { User, UserRole } from '../src/entities/user.entity';

export class InitUserRoot1685428173986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create(User, {
        email: 'root@practice.com',
        password: '123456',
        nickname: 'root',
        role: UserRole.ROOT,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: 'root@practice.com' });
  }
}
