import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Login: FC = () => {
    return (
        <Layout title="AniUpload - Giriş">
            <div class="center-layout">
                <div class="panel-card">
                    <div class="card-header">
                        <h1>AniUpload</h1>
                        <p>Arşive giriş yap</p>
                    </div>

                    <form action="/dashboard" method="post">
                        <div class="form-group">
                            <label for="username">Kullanıcı Adı</label>
                            <input type="text" id="username" class="form-input" name="username" required />
                        </div>

                        <div class="form-group">
                            <label for="password">Şifre</label>
                            <input type="password" id="password" class="form-input" name="password" required />
                        </div>

                        <div class="form-group" style={{ marginTop: '20px' }}>
                            <label for="slider">Ayar (Slider)</label>
                            <input type="range" id="slider" class="form-slider" min="0" max="100" />
                        </div>

                        <button type="submit" class="btn">Giriş Yap</button>
                    </form>

                    <div class="footer-links">
                        <a href="#">Şifremi Unuttum</a> | <a href="#">Kayıt Ol</a>
                    </div>
                </div>
            </div>

            {/* Toast Example Component Area */}
            <div class="toast-container">
                <div class="toast">
                    <strong>Bilgi:</strong> Lorem ipsum dolor sit amet, consectetur.
                </div>
            </div>
        </Layout>
    );
};
