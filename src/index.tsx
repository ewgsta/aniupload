import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';

import { uploadRoutes } from './routes/upload.routes.js';
import { logger } from './utils/logger.js';
import { Dashboard } from './views/pages/Dashboard.js';
import { Login } from './views/pages/Login.js';
import { Register } from './views/pages/Register.js';
import { AuthService } from './services/auth.service.js';
import { initDb } from './db/index.js';

const app = new Hono();
const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// Global Middlewares
app.use('*', cors());

// Static Files
app.use('/css/*', serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/css/, '/src/views/components')
}));

// ----- AUTH & UI ROUTES -----

app.get('/', async (c) => {
    // Check if already logged in
    const token = getCookie(c, 'auth_token');
    if (token) {
        try {
            await verify(token, JWT_SECRET, 'HS256');
            return c.redirect('/dashboard');
        } catch (e) {
            deleteCookie(c, 'auth_token');
        }
    }
    const error = c.req.query('error');
    return c.html(<Login error={error} />);
});

app.post('/login', async (c) => {
    const body = await c.req.parseBody();
    const username = body.username as string;
    const password = body.password as string;

    const user = await authService.verifyUser(username, password);

    if (user) {
        const payload = {
            id: user.id,
            username: user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
        };
        const token = await sign(payload, JWT_SECRET);
        setCookie(c, 'auth_token', token, { path: '/', httpOnly: true });

        return c.redirect('/dashboard');
    } else {
        return c.redirect('/?error=Geçersiz kullanıcı adı veya şifre.');
    }
});

app.get('/register', (c) => {
    const error = c.req.query('error');
    return c.html(<Register error={error} />);
});

app.post('/register', async (c) => {
    const body = await c.req.parseBody();
    const username = body.username as string;
    const email = body.email as string;
    const password = body.password as string;

    const success = await authService.registerUser(username, email, password);

    if (success) {
        // Hata parametresini bilgilendirme olarak da kullanabiliriz
        return c.redirect('/?error=Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    } else {
        return c.redirect('/register?error=Bu kullanıcı adı veya e-posta zaten kullanımda.');
    }
});

app.get('/logout', (c) => {
    deleteCookie(c, 'auth_token', { path: '/' });
    return c.redirect('/');
});

app.get('/dashboard', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) {
        return c.redirect('/?error=Lütfen giriş yapın.');
    }

    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        // Valid token
        return c.html(<Dashboard username={payload.username as string} />);
    } catch (e) {
        deleteCookie(c, 'auth_token', { path: '/' });
        return c.redirect('/?error=Oturum süresi doldu, tekrar giriş yapın.');
    }
});

// ----- API ROUTES -----
const apiV1 = new Hono();

// API Health Check
apiV1.get('/', (c) => {
    return c.json({ version: 'v1', status: 'ok', message: 'AniUpload API v1 is running!' });
});

apiV1.route('/upload', uploadRoutes);

app.route('/api/v1', apiV1);

// ----- SERVER INIT -----
const port = 3000;

initDb().catch((e) => logger.error('DB Init Error:', e));

serve({
    fetch: app.fetch,
    port
}, (info) => {
    logger.info(`Server running at http://localhost:${info.port}`);
});
