/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

interface SettingsProps {
    username: string;
    settings: Record<string, string>;
    error?: string;
    success?: string;
}

export const Settings: FC<SettingsProps> = ({ username, settings, error, success }) => {
    return (
        <Layout title="AniUpload - Ayarlar">
            <nav class="transparent-nav">
                <h2>Sistem Ayarları</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/dashboard" class="btn btn-small" style={{ textDecoration: 'none', background: '#dcdcdc', color: '#333' }}>Panele Dön</a>
                </div>
            </nav>

            <div class="dashboard-container" style={{ maxWidth: '800px' }}>
                {success && (
                    <div style={{ backgroundColor: '#eef5e5', border: '1px solid #c2bba8', color: '#3b5323', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                        <strong>Başarılı!</strong> {success}
                    </div>
                )}
                {error && (
                    <div style={{ backgroundColor: '#fcf2f2', border: '1px solid #dca7a7', color: '#a94442', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
                        <strong>Hata:</strong> {error}
                    </div>
                )}

                <div class="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '15px 20px', backgroundColor: '#e8e0d0', borderBottom: '1px solid #c2bba8' }}>
                        <h3 style={{ margin: 0, color: '#3b5323', fontSize: '15px' }}>Abyss.to Servis Ayarları</h3>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <form action="/settings/save" method="POST">
                            <div class="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>Abyss API Key</label>
                                <input
                                    type="text"
                                    name="abyss_api_key"
                                    value={settings['abyss_api_key'] || ''}
                                    placeholder="Abyss API anahtarını girin..."
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                <p style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                    Abyss.to hesabınızdan aldığınız 32 karakterlik API anahtarı.
                                </p>
                            </div>

                            <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px', textAlign: 'right' }}>
                                <button type="submit" class="btn" style={{ background: 'linear-gradient(to bottom, #7ba05b 0%, #5a7d3c 100%)', color: '#fff' }}>Ayarları Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="panel-card" style={{ padding: '20px', marginTop: '20px', backgroundColor: '#fafafa' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Sistem Bilgisi</h4>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        Servis anahtarlarınız veritabanında şifrelenmeden tutulur. Güvenliğiniz için anahtarlarınızı kimseyle paylaşmayın.
                        Gelecekte diğer servis (Mail.ru, Sibnet vb.) destekleri eklenecektir.
                    </p>
                </div>
            </div>
        </Layout>
    );
};
