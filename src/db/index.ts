import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
let url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (isProd) {
    if (!url) {
        throw new Error('TURSO_DATABASE_URL is required in production environment.');
    }
} else {
    url = url || 'file:./local.db';
}

export const db = createClient({
    url: url!,
    authToken,
});

// Initialize tables if they don't exist
export const initDb = async () => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] Database initialized successfully.');
};
