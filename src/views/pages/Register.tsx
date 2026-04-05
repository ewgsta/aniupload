import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Register: FC<{ error?: string }> = ({ error }) => {
    return (
        <Layout title="AniUpload - Kayıt Ol">
            <div class="center-layout">
                <div class="panel-card">
                    <div class="card-header">
                        <h1>AniUpload</h1>
                        <p>Aramıza Katıl</p>
                    </div>

                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '15px', borderRadius: '4px', fontSize: '13px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form action="/register" method="post">
                        <div class="form-group">
                            <label for="username">Kullanıcı Adı</label>
                            <input type="text" id="username" class="form-input" name="username" required />
                        </div>
                        <div class="form-group">
                            <label for="email">E-Posta Adresi</label>
                            <input type="email" id="email" class="form-input" name="email" required />
                        </div>

                        <div class="form-group">
                            <label for="password">Şifre</label>
                            <input type="password" id="password" class="form-input" name="password" required />
                        </div>

                        <button type="submit" class="btn">Kayıt Ol</button>
                    </form>

                    <div class="footer-links">
                        <a href="/">Zaten hesabın var mı? Giriş Yap</a>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
