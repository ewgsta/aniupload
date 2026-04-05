import type { Context } from 'hono';
export declare class UploadController {
    private uploadService;
    constructor();
    handleUpload: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
        message: string;
        data: {
            success: boolean;
            id: string;
        };
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, 500, "json">)>;
}
//# sourceMappingURL=upload.controller.d.ts.map