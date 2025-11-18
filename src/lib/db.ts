import { Pool } from 'pg';

// Configure SSL based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
const sslConfig = databaseUrl && (databaseUrl.includes('sslmode=require') || process.env.NODE_ENV === 'production')
  ? { rejectUnauthorized: false }
  : false;

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: sslConfig,
});

export async function query(text: string, params?: unknown[]) {
  const res = await pool.query(text, params);
  return res;
}

// 範例：
// const result = await query('SELECT NOW()');
