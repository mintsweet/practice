import 'dotenv/config';
import { hashSync, genSaltSync } from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';

import { users, sections, tags } from './schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { users, sections, tags }).refine((func) => ({
    users: {
      count: 1,
      columns: {
        email: func.default({ defaultValue: 'root@practice.com' }),
        password: func.default({
          defaultValue: hashSync('a.123456', genSaltSync(10)),
        }),
        nickname: func.default({ defaultValue: 'root' }),
        score: func.default({ defaultValue: 100 }),
        role: func.default({ defaultValue: 101 }),
      },
    },
    sections: {
      count: 2,
      columns: {
        name: func.valuesFromArray({ values: ['General', 'Q&A'] }),
        description: func.valuesFromArray({
          values: ['General talk', 'Questions and Answers'],
        }),
      },
    },
    tags: {
      count: 1,
      columns: {
        name: func.valuesFromArray({ values: ['Share'] }),
        description: func.valuesFromArray({
          values: ['Share anything.'],
        }),
      },
    },
  }));
}

main()
  .then(() => {
    console.log('✅ Seeding done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
