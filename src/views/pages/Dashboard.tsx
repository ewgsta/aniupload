/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';

export const Dashboard: FC<{ username: string; showSuccessToast?: boolean; totalAnime?: number; totalEpisodes?: number }> = ({ username, showSuccessToast, totalAnime = 0, totalEpisodes = 0 }) => {
    return (
        <Layout title="AniUpload - Dashboard">
            <nav class="transparent-nav">
                <h2>AniUpload Arşivi</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/logout" class="btn btn-small" style={{ textDecoration: 'none' }}>Çıkış Yap</a>
                </div>
            </nav>

            <div class="dashboard-container">
                <div style={{ borderBottom: '1px dotted #ccc', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h2 style={{ color: '#3b5323', fontSize: '20px' }}>Sistem Özeti</h2>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', border: '1px solid #c2bba8', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '13px', color: '#666', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toplam Anime</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b5323', textShadow: '1px 1px 0px #eee' }}>{totalAnime}</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', border: '1px solid #c2bba8', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ fontSize: '13px', color: '#666', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toplam Bölüm</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b5323', textShadow: '1px 1px 0px #eee' }}>{totalEpisodes}</p>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #c2bba8', borderRadius: '4px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '10px', color: '#3b5323' }}>Hızlı İşlemler</h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '10px 0 15px 0' }}>Sistemde bekleyen bir video işleme bulunmuyor.</p>
                    <a href="/upload" class="btn btn-auto" style={{ textDecoration: 'none' }}>Yeni Anime Yükle</a>
                    <a href="/archive" class="btn btn-auto" style={{ marginLeft: '10px', textDecoration: 'none', background: 'linear-gradient(to bottom, #dcdcdc 0%, #c0c0c0 100%)', borderColor: '#888', color: '#333', textShadow: '1px 1px 0 #fff' }}>Arşivi İncele</a>
                    <a href="/settings" class="btn btn-auto" style={{ marginLeft: '10px', textDecoration: 'none', background: '#f5f5f5', color: '#666', borderColor: '#ccc' }}>⚙ Ayarlar</a>
                </div>
            </div>

            {showSuccessToast && (
                <div class="toast-container">
                    <div class="toast">
                        <strong>Bilgi:</strong> Sisteme başarıyla giriş yaptınız.
                        <div class="toast-progress"></div>
                    </div>
                </div>
            )}
        </Layout>
    );
};
