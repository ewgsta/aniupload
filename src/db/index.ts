import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:./local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
    url,
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
