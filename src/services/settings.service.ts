import { db } from '../db/index.js';

export class SettingsService {
    static async get(key: string): Promise<string | null> {
        const res = await db.execute({
            sql: 'SELECT value FROM settings WHERE key = ?',
            args: [key]
        });
        if (res.rows.length === 0) return null;
        return res.rows[0].value as string;
    }

    static async getAll(): Promise<Record<string, string>> {
        const res = await db.execute('SELECT key, value FROM settings');
        const settings: Record<string, string> = {};
        res.rows.forEach(row => {
            settings[row.key as string] = row.value as string;
        });
        return settings;
    }

    static async set(key: string, value: string): Promise<void> {
        await db.execute({
            sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
            args: [key, value]
        });
    }

    static async delete(key: string): Promise<void> {
        await db.execute({
            sql: 'DELETE FROM settings WHERE key = ?',
            args: [key]
        });
    }
}
