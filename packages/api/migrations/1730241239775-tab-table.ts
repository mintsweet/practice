import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { Tab } from '../src/entities';

export class TabTable1730241239775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tab',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sign',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'summary',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'is_delete',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.manager.save([
      queryRunner.manager.create(Tab, {
        sign: 'pinned',
      }),
      queryRunner.manager.create(Tab, {
        sign: 'featured',
      }),
      queryRunner.manager.create(Tab, {
        sign: 'share',
      }),
      queryRunner.manager.create(Tab, {
        sign: 'ask',
      }),
      queryRunner.manager.create(Tab, {
        sign: 'job',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tab');
  }
}
