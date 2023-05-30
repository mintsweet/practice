import { DataSource } from 'typeorm';

const datasource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'practice',
  entities: ['./src/entities/**/*.ts'],
  migrations: ['./migrations/**/*.ts'],
});

export default datasource;
