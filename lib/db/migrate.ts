import dotenv from 'dotenv';
import path from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { client, db } from './drizzle';

dotenv.config();

async function main() {
  console.log('Running migrations...');
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), '/lib/db/migrations'),
  });
  console.log('Migrations complete');
  await client.end();
}

main().catch((err) => {
  console.error('Migration failed');
  console.error(err);
  process.exit(1);
});
