import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class intUserTable1685426744431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          { name: 'email', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'nickname', type: 'varchar' },
          { name: 'avatar', type: 'varchar', isNullable: true },
          { name: 'location', type: 'varchar', isNullable: true },
          { name: 'signature', type: 'varchar', isNullable: true },
          { name: 'score', type: 'int', default: 0 },
          { name: 'is_star', type: 'bool', default: false },
          { name: 'is_lock', type: 'bool', default: false },
          { name: 'is_delete', type: 'bool', default: false },
          { name: 'topic_count', type: 'int', default: 0 },
          { name: 'star_count', type: 'int', default: 0 },
          { name: 'collect_count', type: 'int', default: 0 },
          { name: 'follower_count', type: 'int', default: 0 },
          { name: 'following_count', type: 'int', default: 0 },
          {
            name: 'role',
            type: 'enum',
            enum: ['root', 'admin', 'user'],
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

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_NAME',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'IDX_USER_NAME');
    await queryRunner.dropTable('user');
  }
}
