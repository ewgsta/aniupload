import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { uploadRoutes } from './routes/upload.routes.js';
import { logger } from './utils/logger.js';
import { Dashboard } from './views/Dashboard.js';

const app = new Hono();

// Global Middlewares
app.use('*', cors());

// UI Routes (JSX rendered)
app.get('/', (c) => {
    return c.html(<Dashboard apiStatus="Online" />);
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
logger.info(`Server is starting on port ${port}...`);

serve({
    fetch: app.fetch,
    port
});
