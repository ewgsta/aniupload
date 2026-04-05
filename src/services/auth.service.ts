import { db } from '../db/index.js';
import * as bcrypt from 'bcryptjs';

export class AuthService {
    public async verifyUser(usernameOrEmail: string, passwordAttempt: string): Promise<boolean> {
        try {
            const result = await db.execute({
                sql: 'SELECT password_hash FROM users WHERE username = ? OR email = ?',
                args: [usernameOrEmail, usernameOrEmail]
            });

            if (result.rows.length === 0) {
                return false;
            }

            const hash = result.rows[0].password_hash as string;
            const isValid = await bcrypt.compare(passwordAttempt, hash);
            return isValid;
        } catch (e) {
            console.error('Auth verification error:', e);
            return false;
        }
    }
}
