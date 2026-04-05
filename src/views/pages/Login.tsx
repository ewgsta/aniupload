/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Login: FC<{ error?: string }> = ({ error }) => {
    const isErrorReal = error ? !error.toLowerCase().includes('başarılı') : false;

    return (
        <Layout title="AniUpload - Giriş">
            <div class="center-layout">
                <div class="panel-card">
                    <div class="card-header">
                        <h1>AniUpload</h1>
                    </div>

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

            {error && (
                <div class="toast-container">
                    <div class="toast" style={{ borderLeftColor: isErrorReal ? '#991b1b' : '#6b8e23' }}>
                        <strong style={{ color: isErrorReal ? '#991b1b' : '#6b8e23' }}>
                            {isErrorReal ? 'Hata:' : 'Bilgi:'}
                        </strong> {error}
                        <div class="toast-progress" style={{ backgroundColor: isErrorReal ? '#991b1b' : '#6b8e23' }}></div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
