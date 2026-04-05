import type { Context } from 'hono';
import { UploadService } from '../services/upload.service.js';

export class UploadController {
    private uploadService: UploadService;

    constructor() {
        this.uploadService = new UploadService();
    }

    public handleUpload = async (c: Context) => {
        // In a real scenario, you parse the multipart form data here
        const name = c.req.query('name') || 'unknown.ext';

        const result = await this.uploadService.handleUpload({
            name,
            size: 1024,
        });

        if (result.success) {
            return c.json({ message: 'Upload successful', data: result }, 201);
        }

        return c.json({ message: 'Upload failed' }, 500);
    };
}
