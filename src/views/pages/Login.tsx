import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Login: FC<{ error?: string }> = ({ error }) => {
    return (
        <Layout title="AniUpload - Giriş">
            <div class="center-layout">
                <div class="panel-card">
                    <div class="card-header">
                        <h1>AniUpload</h1>
                        <p>Arşive giriş yap</p>
                    </div>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '15px', borderRadius: '4px', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form action="/login" method="post">
                        <div class="form-group">
                            <label for="username">Kullanıcı Adı veya Email</label>
                            <input type="text" id="username" class="form-input" name="username" required />
                        </div>

                        <div class="form-group">
                            <label for="password">Şifre</label>
                            <input type="password" id="password" class="form-input" name="password" required />
                        </div>

                        <button type="submit" class="btn">Giriş Yap</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
