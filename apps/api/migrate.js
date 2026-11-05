import pg from 'pg';
import { readFile } from 'node:fs/promises';
if (process.env.NODE_ENV === 'production') throw new Error('Production migrations not configured');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try { await pool.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8')); } finally { await pool.end(); }
