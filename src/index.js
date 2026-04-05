import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { uploadRoutes } from './routes/upload.routes.js';
import { logger } from './utils/logger.js';
const app = new Hono();
// Global Middlewares
app.use('*', cors());
// Health Check
app.get('/', (c) => {
    return c.json({ status: 'ok', message: 'AniUpload API is running!' });
});
// Register Routes
app.route('/api/upload', uploadRoutes);
const port = 3000;
logger.info(`Server is starting on port ${port}...`);
serve({
    fetch: app.fetch,
    port
});
//# sourceMappingURL=index.js.map