// Single shared connection pool. Every query in the app goes through this —
// nothing outside lib/ ever touches Postgres directly, and this file is only
// ever imported from server-side code (API routes, server components).
import { Pool } from 'pg';

let pool;

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL is not set. Copy .env.local.example to .env.local and fill in your connection string.'
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
