import { db } from '../db/index.js';
import * as bcrypt from 'bcryptjs';

export class AuthService {
    public async verifyUser(usernameOrEmail: string, passwordAttempt: string): Promise<{ id: number, username: string } | null> {
        try {
            const result = await db.execute({
                sql: 'SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?',
                args: [usernameOrEmail, usernameOrEmail]
            });

            if (result.rows.length === 0) {
                return null;
            }

            const hash = result.rows[0].password_hash as string;
            const isValid = await bcrypt.compare(passwordAttempt, hash);
            if (isValid) {
                return {
                    id: result.rows[0].id as number,
                    username: result.rows[0].username as string
                };
            }
            return null;
        } catch (e) {
            console.error('Auth verification error:', e);
            return null;
        }
    }

    public async registerUser(username: string, email: string, passwordAttempt: string): Promise<boolean> {
        try {
            const hash = await bcrypt.hash(passwordAttempt, 10);
            await db.execute({
                sql: 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                args: [username, email, hash]
            });
            return true;
        } catch (e) {
            console.error('Auth registration error:', e);
            return false;
        }
    }
}
