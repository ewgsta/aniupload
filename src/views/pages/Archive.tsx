import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';
import { html } from 'hono/html';

interface AnimeRow {
    id: number;
    mal_id: number | null;
    title: string;
    seasons_data: string | null;
    created_at: string;
}

export const Archive: FC<{ username: string; animes: AnimeRow[] }> = ({ username, animes }) => {
    return (
        <Layout title="AniUpload - Arşiv">
            <nav class="transparent-nav">
                <h2>AniUpload Arşivi</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/dashboard" class="btn btn-small" style={{ textDecoration: 'none' }}>← Dashboard</a>
                    <a href="/logout" class="btn btn-small" style={{ textDecoration: 'none' }}>Çıkış Yap</a>
                </div>
            </nav>

            <div class="dashboard-container">
                <div style={{ borderBottom: '1px dotted #ccc', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: '#3b5323', fontSize: '20px' }}>İndekslenen Animeler ({animes.length})</h2>
                    <a href="/upload" class="btn btn-small" style={{ textDecoration: 'none' }}>+ Yeni Anime Yükle</a>
                </div>

                {animes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
                        <p style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '15px' }}>Henüz arşivde anime bulunmuyor.</p>
                        <a href="/upload" class="btn btn-auto" style={{ textDecoration: 'none' }}>İlk Animeyi Yükle</a>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', backgroundColor: '#fff', border: '1px solid #c2bba8' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e8e0d0', borderBottom: '2px solid #c2bba8' }}>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MAL</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Anime Adı</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sezon</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Toplam Bölüm</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tarih</th>
                                <th style={{ padding: '10px 12px', textAlign: 'center', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animes.map((anime, idx) => {
                                let seasons: any[] = [];
                                let totalEps = 0;
                                try {
                                    seasons = JSON.parse(anime.seasons_data || '[]');
                                    totalEps = seasons.reduce((sum: number, s: any) => sum + (s.episodes || 0), 0);
                                } catch { }

                                return (
                                    <tr style={{ borderBottom: '1px solid #e8e0d0', backgroundColor: idx % 2 === 0 ? '#fafaf5' : '#fff' }}>
                                        <td style={{ padding: '10px 12px', color: '#999', fontFamily: 'monospace' }}>#{anime.id}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            {anime.mal_id ? (
                                                <a href={`https://myanimelist.net/anime/${anime.mal_id}`} target="_blank"
                                                    style={{ color: '#2e51a2', textDecoration: 'none', fontFamily: 'monospace' }}>
                                                    {anime.mal_id}
                                                </a>
                                            ) : (<span style={{ color: '#ccc' }}>—</span>)}
                                        </td>
                                        <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#333' }}>{anime.title}</td>
                                        <td style={{ padding: '10px 12px', color: '#666' }}>{seasons.length} sezon</td>
                                        <td style={{ padding: '10px 12px', color: '#666' }}>{totalEps} bölüm</td>
                                        <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>{anime.created_at ? new Date(anime.created_at).toLocaleDateString('tr-TR') : '—'}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                            <button class="btn btn-small" style={{ fontSize: '11px', padding: '3px 8px', background: 'linear-gradient(to bottom,#f5f5f5,#ddd)', color: '#333', borderColor: '#aaa', textShadow: 'none' }}
                                                onclick={`if(confirm('${anime.title} arşivden silinsin mi?')) deleteAnime(${anime.id})`}>Sil</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {html`
            <script>
                function deleteAnime(id) {
                    fetch('/api/v1/upload/anime/' + id, { method: 'DELETE' })
                        .then(res => res.json())
                        .then(res => {
                            if(res.status === 'ok') {
                                window.location.reload();
                            } else {
                                alert('Silme başarısız: ' + (res.message || 'Bilinmeyen hata'));
                            }
                        })
                        .catch(e => alert('İstek hatası: ' + e.message));
                }
            </script>
            `}
        </Layout>
    );
};
