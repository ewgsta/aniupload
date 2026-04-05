import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';
import { html } from 'hono/html';

interface Episode {
    id: number;
    season: number;
    episode: number;
    services: string;
    created_at: string;
}

interface Anime {
    id: number;
    mal_id: number | null;
    title: string;
    seasons_data: string | null;
    created_at: string;
}

export const ArchiveDetail: FC<{ username: string; anime: Anime; episodes: Episode[] }> = ({ username, anime, episodes }) => {
    let seasons: any[] = [];
    let totalEps = 0;
    try {
        seasons = JSON.parse(anime.seasons_data || '[]');
        totalEps = seasons.reduce((sum: number, s: any) => sum + (s.episodes || 0), 0);
    } catch { }

    const isComplete = episodes.length >= totalEps;

    return (
        <Layout title={`AniUpload - ${anime.title} Detay`}>
            <nav class="transparent-nav">
                <h2>Anime Detayı</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/archive" class="btn btn-small" style={{ textDecoration: 'none', background: '#dcdcdc', color: '#333' }}>Arşive Dön</a>
                </div>
            </nav>

            <div class="dashboard-container" style={{ maxWidth: '1000px' }}>
                <div style={{ backgroundColor: '#fff', border: '1px solid #c2bba8', padding: '20px', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ margin: '0 0 10px 0', color: '#3b5323', fontSize: '24px' }}>{anime.title}</h1>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#666' }}>
                                <span><strong>MAL ID:</strong> {anime.mal_id || '--'}</span>
                                <span><strong>Sezon Sayısı:</strong> {seasons.length}</span>
                                <span><strong>Toplam Bölüm:</strong> {totalEps}</span>
                                <span><strong>Yüklenen:</strong> {episodes.length}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            {!isComplete && (
                                <a href={`/upload?anime_id=${anime.id}`} class="btn" style={{ textDecoration: 'none', background: 'linear-gradient(to bottom, #7ba05b 0%, #5a7d3c 100%)', color: '#fff' }}>+ Yeni Bölüm Ekle</a>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#fff', border: '1px solid #c2bba8', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 15px', backgroundColor: '#e8e0d0', borderBottom: '1px solid #c2bba8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#3b5323', fontSize: '15px' }}>Yüklenmiş Bölümler</h3>
                    </div>

                    {episodes.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                            Henüz hiç bölüm yüklenmemiş.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9f6f0', borderBottom: '1px solid #eee' }}>
                                    <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>Sezon / Bölüm</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Yayınlandığı Servisler & Bağlantılar</th>
                                    <th style={{ padding: '12px', textAlign: 'right', width: '120px' }}>Yükleme Tarihi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {episodes.sort((a, b) => (a.season * 1000 + a.episode) - (b.season * 1000 + b.episode)).map((ep, idx) => {
                                    let services: Record<string, string> = {};
                                    try { services = JSON.parse(ep.services || '{}'); } catch { }
                                    const serviceKeys = Object.keys(services);

                                    return (
                                        <tr style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: idx % 2 === 1 ? '#fafafa' : '#fff' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b5323', textAlign: 'center' }}>
                                                <div style={{ marginBottom: '5px' }}>S{ep.season.toString().padStart(2, '0')} E{ep.episode.toString().padStart(2, '0')}</div>
                                                <button onclick="copyRowUrls(this)" class="btn btn-small" style={{ fontSize: '10px', padding: '2px 5px', margin: 0, textShadow: 'none', background: '#f0f0f0', color: '#333', borderColor: '#ccc' }}>Tümünü Kopyala</button>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {serviceKeys.map(key => {
                                                        const url = services[key];
                                                        return (
                                                            <div class="service-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>
                                                                <span style={{ fontWeight: 'bold', marginRight: '6px', borderRight: '1px solid #eee', paddingRight: '6px' }}>{key}</span>
                                                                <a href={url} target="_blank" style={{ color: '#2e51a2', textDecoration: 'none', maxWidth: '200px', overflow: 'hidden', textHighlight: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</a>
                                                                <button onclick={`copyUrl('${url.replace(/'/g, "\\'")}')`} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '6px', padding: 0, color: '#666', fontSize: '10px', textDecoration: 'underline' }}>Kopyala</button>
                                                                <span class="url-data" style={{ display: 'none' }} data-url={url}></span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right', color: '#888', fontSize: '12px' }}>
                                                {new Date(ep.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Notification Toast */}
            <div id="copy-toast" style={{
                display: 'none', position: 'fixed', bottom: '20px', right: '20px',
                backgroundColor: '#f9f6f0', border: '1px solid #c2bba8', borderLeft: '4px solid #6b8e23',
                borderRadius: '4px', padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontSize: '13px', color: '#333', zIndex: 9999, minWidth: '200px'
            }}>
                <strong>Bilgi:</strong> <span id="copy-toast-msg">URL kopyalandı!</span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', backgroundColor: '#6b8e23', width: '100%', animation: 'toast-progress-anim 3s linear forwards' }}></div>
            </div>

            {html`
            <script>
                function showCopyToast(msg) {
                    const t = document.getElementById('copy-toast');
                    document.getElementById('copy-toast-msg').innerText = msg || 'URL kopyalandı!';
                    t.style.display = 'block';
                    setTimeout(() => { t.style.display = 'none'; }, 2000);
                }

                function copyUrl(url) {
                    navigator.clipboard.writeText(url).then(() => showCopyToast('URL kopyalandı!'));
                }

                function copyRowUrls(btn) {
                    const row = btn.closest('tr');
                    const urls = [];
                    row.querySelectorAll('.url-data').forEach(el => urls.push(el.getAttribute('data-url')));
                    if(urls.length === 0) return;
                    navigator.clipboard.writeText(urls.join('\\n')).then(() => showCopyToast(urls.length + ' URL kopyalandı!'));
                }

                function copyAllUrls(animeId) {
                    const urls = [];
                    document.querySelectorAll('.url-data').forEach(el => urls.push(el.getAttribute('data-url')));
                    if(urls.length === 0) return;
                    navigator.clipboard.writeText(urls.join('\\n')).then(() => showCopyToast(urls.length + ' URL kopyalandı!'));
                }
            </script>
            `}
        </Layout>
    );
};
