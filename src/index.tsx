import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { uploadRoutes } from './routes/upload.routes.js';
import { logger } from './utils/logger.js';
import { Dashboard } from './views/pages/Dashboard.js';
import { Login } from './views/pages/Login.js';
import { serveStatic } from '@hono/node-server/serve-static';
import { AuthService } from './services/auth.service.js';
import { initDb } from './db/index.js';

const app = new Hono();
const authService = new AuthService();

// Global Middlewares
app.use('*', cors());

// Static Files
app.use('/css/*', serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/css/, '/src/views/components')
}));

// UI Routes (JSX rendered)
app.get('/', (c) => {
    return c.html(<Login />);
});

app.post('/dashboard', async (c) => {
    const body = await c.req.parseBody();
    const username = body.username as string;
    const password = body.password as string;

    const isValid = await authService.verifyUser(username, password);

    if (isValid) {
        return c.redirect('/dashboard');
    } else {
        return c.text('Unauthorized: Hatalı giriş!', 401);
    }
});

app.get('/dashboard', (c) => {
    return c.html(<Dashboard />);
});

// Create API v1 group
const apiV1 = new Hono();

// API Health Check
apiV1.get('/', (c) => {
    return c.json({ version: 'v1', status: 'ok', message: 'AniUpload API v1 is running!' });
});

// API Routes
apiV1.route('/upload', uploadRoutes);

// Register API Group
app.route('/api/v1', apiV1);

const port = 3000;

initDb().catch((e) => logger.error('DB Init Error:', e));

serve({
    fetch: app.fetch,
    port
}, (info) => {
    logger.info(`Server running at http://localhost:${info.port}`);
});
