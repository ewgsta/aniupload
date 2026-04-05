import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Login: FC = () => {
    return (
        <Layout title="AniUpload - Giriş">
            <div class="center-layout">
                <div class="panel-card">
                    <div class="card-header">
                        <h1>AniUpload</h1>
                    </div>

                    <form action="/dashboard" method="post">
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
