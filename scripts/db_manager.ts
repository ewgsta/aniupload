import { db } from '../src/db/index.js';
import * as bcrypt from 'bcryptjs';

const args = process.argv.slice(2);
const command = args[0];

async function run() {
    if (command === 'create') {
        const username = args[1];
        const email = args[2];
        const password = args[3];

        if (!username || !email || !password) {
            console.error('Usage: manage_users.sh create <username> <email> <password>');
            process.exit(1);
        }

        try {
            const passwordHash = await bcrypt.hash(password, 10);
            await db.execute({
                sql: 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                args: [username, email, passwordHash]
            });
            console.log(`User created successfully: ${username}`);
        } catch (e: any) {
            console.error('Error creating user:', e.message);
        }
    } else if (command === 'delete') {
        const identifier = args[1]; // username or email

        if (!identifier) {
            console.error('Usage: manage_users.sh delete <username_or_email>');
            process.exit(1);
        }

        try {
            const result = await db.execute({
                sql: 'DELETE FROM users WHERE username = ? OR email = ?',
                args: [identifier, identifier]
            });
            if (result.rowsAffected > 0) {
                console.log(`User deleted successfully: ${identifier}`);
            } else {
                console.log(`User not found: ${identifier}`);
            }
        } catch (e: any) {
            console.error('Error deleting user:', e.message);
        }
    } else {
        console.error('Unknown command. Use "create" or "delete".');
        process.exit(1);
    }
}

run();
