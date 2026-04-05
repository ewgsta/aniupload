import type { FC } from 'hono/jsx';
import { Layout } from './Layout.js';

interface DashboardProps {
    apiStatus: string;
}

export const Dashboard: FC<DashboardProps> = ({ apiStatus }) => {
    return (
        <Layout>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-bold mb-4">Welcome to AniUpload</h2>
                <p class="text-gray-600 mb-2">Manage your uploads securely and easily.</p>
                <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h3 class="font-semibold">System Diagnostics</h3>
                    <p class="text-sm mt-1">API v1 Status: <span class="text-green-600 font-bold">{apiStatus}</span></p>
                </div>
            </div>
        </Layout>
    );
};
