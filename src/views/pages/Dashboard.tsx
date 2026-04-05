import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Dashboard: FC = () => {
    return (
        <Layout title="AniUpload - Dashboard">
            <nav class="transparent-nav">
                <h2>AniUpload Arşivi</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: ewgsta</span>
                    <a href="/" class="btn btn-small" style={{ textDecoration: 'none' }}>Çıkış Yap</a>
                </div>
            </nav>

            <div class="dashboard-container">
                <div style={{ borderBottom: '1px dotted #ccc', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ color: '#3b5323', fontSize: '20px' }}>Sistem Özeti</h2>
                </div>

                <p style={{ color: '#4a4a4a', lineHeight: '1.6', marginBottom: '20px', fontSize: '14px' }}>
                    Başarıyla giriş yaptınız. Bu alanda ileride arşivlediğiniz serileri, istatistiklerinizi ve yönetimsel ayarları
                    düzenleyebileceksiniz.
                </p>

                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #c2bba8', borderRadius: '4px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '10px', color: '#3b5323' }}>Hızlı İşlemler</h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '10px 0 15px 0' }}>Sistemde bekleyen bir video işleme bulunmuyor.</p>
                    <button class="btn btn-auto">Yeni Anime Yükle</button>
                    <button class="btn btn-auto" style={{ marginLeft: '10px', background: 'linear-gradient(to bottom, #dcdcdc 0%, #c0c0c0 100%)', borderColor: '#888', color: '#333', textShadow: '1px 1px 0 #fff' }}>Arşivi İncele</button>
                </div>
            </div>
        </Layout>
    );
};
