import { SettingsService } from './settings.service.js';

export class AbyssService {
    private static API_URL = 'https://api.abyss.to';
    private static UPLOAD_URL = 'https://up.abyss.to';

    static async getApiKey(): Promise<string | null> {
        return await SettingsService.get('abyss_api_key');
    }

    static async getStatus(): Promise<any> {
        const key = await this.getApiKey();
        if (!key) throw new Error('Abyss API Key not found');

        const res = await fetch(`${this.API_URL}/v1/about?key=${key}`);
        if (!res.ok) throw new Error(`Abyss API Error: ${res.statusText}`);
        return await res.json();
    }

    /**
     * In a real app, the browser would upload directly to up.abyss.to to save bandwidth.
     * But the user provided a curl example: curl -F "file=@demo.mp4" up.abyss.to/{apiKey}
     */
    static async upload(file: Buffer, fileName: string): Promise<string> {
        const key = await this.getApiKey();
        if (!key) throw new Error('Abyss API Key not found');

        const formData = new FormData();
        const blob = new Blob([file]);
        formData.append('file', blob, fileName);

        const res = await fetch(`${this.UPLOAD_URL}/${key}`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Abyss Upload Error (${res.status}): ${err}`);
        }

        const data = await res.json() as { slug: string };
        return data.slug;
    }

    /**
     * Generates an embed link based on the slug.
     * Usually it's https://abyss.to/embed/{slug} or similar.
     */
    static getEmbedUrl(slug: string): string {
        return `https://abyss.to/embed/${slug}`;
    }
}
