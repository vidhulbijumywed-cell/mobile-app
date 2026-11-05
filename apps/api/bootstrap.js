import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { passwordHash } from './service.js';
if (process.env.NODE_ENV === 'production') throw new Error('Development bootstrap only');
if (!process.env.DEV_ADMIN_EMAIL || !process.env.DEV_ADMIN_PASSWORD || !process.env.DATABASE_URL) throw new Error('DATABASE_URL, DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD required');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
 await pool.query('INSERT INTO users VALUES($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING', [randomUUID(), process.env.DEV_ADMIN_EMAIL.toLowerCase(), 'admin', passwordHash(process.env.DEV_ADMIN_PASSWORD)]);
 console.log('Development bootstrap complete; existing accounts were preserved');
} finally { await pool.end(); }
