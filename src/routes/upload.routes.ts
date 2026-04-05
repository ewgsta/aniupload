import { Hono } from 'hono';
import { UploadController } from '../controllers/upload.controller.js';

const uploadRoutes = new Hono();
const uploadController = new UploadController();

// Map route directly to the controller
uploadRoutes.post('/', uploadController.handleUpload);

export { uploadRoutes };
