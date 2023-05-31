import { config } from 'dotenv';
import { DataSource } from 'typeorm';

const envFile = `.env.${process.env.ENV ?? 'local'}`;

config({ path: envFile });

const { HEALTH_CHECK, DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } =
  process.env;

if (!HEALTH_CHECK) {
  console.error(
    `=====> The current configuration file is ${envFile}, please check whether the file exists`,
  );
  process.exit(1);
}

const datasource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  entities: ['./src/entities/**/*.ts'],
  migrations: ['./migrations/**/*.ts'],
});

export default datasource;
