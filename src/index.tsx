import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';

import { uploadRoutes } from './routes/upload.routes.js';
import { logger } from './utils/logger.js';
import { Dashboard } from './views/pages/Dashboard.js';
import { Upload } from './views/pages/Upload.js';
import { Login } from './views/pages/Login.js';
import { Archive } from './views/pages/Archive.js';
import { AuthService } from './services/auth.service.js';
import { initDb, db } from './db/index.js';

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
        const success = c.req.query('success') === 'true';

        // Real DB stats
        const animesResult = await db.execute('SELECT seasons_data FROM animes');
        const totalAnime = animesResult.rows.length;
        let totalEpisodes = 0;
        animesResult.rows.forEach((row: any) => {
            try {
                const seasons = JSON.parse(row.seasons_data || '[]');
                totalEpisodes += seasons.reduce((sum: number, s: any) => sum + (s.episodes || 0), 0);
            } catch { }
        });

        return c.html(<Dashboard username={payload.username as string} showSuccessToast={success} totalAnime={totalAnime} totalEpisodes={totalEpisodes} />);
    } catch (e) {
        deleteCookie(c, 'auth_token', { path: '/' });
        return c.redirect('/?error=Oturum süresi doldu, tekrar giriş yapın.');
    }
});

app.get('/upload', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) return c.redirect('/?error=Lütfen giriş yapın.');
    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        const animesResult = await db.execute('SELECT id, mal_id, title, seasons_data FROM animes ORDER BY created_at DESC');
        return c.html(<Upload username={payload.username as string} savedAnimes={animesResult.rows as any} />);
    } catch {
        return c.redirect('/?error=Oturum süresi doldu.');
    }
});

app.get('/archive', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) return c.redirect('/?error=Lütfen giriş yapın.');
    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        const animesResult = await db.execute('SELECT id, mal_id, title, seasons_data, created_at FROM animes ORDER BY created_at DESC');
        return c.html(<Archive username={payload.username as string} animes={animesResult.rows as any} />);
    } catch {
        return c.redirect('/?error=Oturum süresi doldu.');
    }
});

// ----- API ROUTES -----
const apiV1 = new Hono();

apiV1.post('/upload/metadata', async (c) => {
    try {
        // Try to parse json regardless of content-type for flexibility
        let body;
        try {
            body = await c.req.json();
        } catch {
            body = await c.req.parseBody();
        }

        const title = body.title as string;
        const malId = body.mal_id ? parseInt(body.mal_id as string) : null;
        const seasonsData = body.seasons_data as string || '[]';

        if (title) {
            await db.execute({
                sql: `INSERT INTO animes (title, mal_id, seasons_data) VALUES (?, ?, ?)
                      ON CONFLICT(title) DO UPDATE SET seasons_data=excluded.seasons_data, mal_id=excluded.mal_id`,
                args: [title, malId, seasonsData]
            });
            return c.json({ status: 'ok' });
        }
        return c.json({ status: 'bad_request' }, 400);
    } catch (e) {
        console.error('Metadata DB error', e);
        return c.json({ status: 'error' }, 500);
    }
});

apiV1.delete('/upload/anime/:id', async (c) => {
    try {
        const id = parseInt(c.req.param('id'));
        await db.execute({ sql: 'DELETE FROM animes WHERE id = ?', args: [id] });
        return c.json({ status: 'ok' });
    } catch (e) {
        console.error('Delete error', e);
        return c.json({ status: 'error' }, 500);
    }
});

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
