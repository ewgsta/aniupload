import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Dashboard: FC = () => {
    return (
        <Layout>
            <div class="card">
                <h2 class="card-title">Dashboard</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    <h3>Lorem Ipsum Feature</h3>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#4b5563' }}>
                        Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.
                    </p>
                    <button class="btn" style={{ marginTop: '1rem' }}>Lorem Ipsum</button>
                </div>
            </div>
        </Layout>
    );
};
