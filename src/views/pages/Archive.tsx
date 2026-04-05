/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';
import { html } from 'hono/html';

interface AnimeRow {
    id: number;
    mal_id: number | null;
    title: string;
    seasons_data: string | null;
    created_at: string;
    uploaded_count: number;
}

export const Archive: FC<{ username: string; animes: AnimeRow[] }> = ({ username, animes }) => {
    return (
        <Layout title="AniUpload - Arsiv">
            <nav class="transparent-nav">
                <h2>AniUpload Arsivi</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/dashboard" class="btn btn-small" style={{ textDecoration: 'none' }}>Dashboard</a>
                    <a href="/logout" class="btn btn-small" style={{ textDecoration: 'none' }}>Cikis Yap</a>
                </div>
            </nav>

            <div class="dashboard-container" style={{ maxWidth: '950px' }}>
                <div style={{ borderBottom: '1px dotted #ccc', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: '#3b5323', fontSize: '20px' }}>Animeler ({animes.length})</h2>
                    <a href="/upload" class="btn btn-small" style={{ textDecoration: 'none' }}>+ Yeni Anime Yukle</a>
                </div>

                {animes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
                        <p style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '15px' }}>Henuz arsivde anime bulunmuyor.</p>
                        <a href="/upload" class="btn btn-auto" style={{ textDecoration: 'none' }}>Ilk Animeyi Yukle</a>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', backgroundColor: '#fff', border: '1px solid #c2bba8' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e8e0d0', borderBottom: '2px solid #c2bba8' }}>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MAL</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Anime Adi</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sezon</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yuklenen</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tarih</th>
                                <th style={{ padding: '10px 12px', textAlign: 'center', color: '#3b5323', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Islem</th>
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
                                const uploaded = anime.uploaded_count || 0;
                                const isComplete = totalEps > 0 && uploaded >= totalEps;

                                return (
                                    <>
                                        <tr style={{ borderBottom: '1px solid #e8e0d0', backgroundColor: idx % 2 === 0 ? '#fafaf5' : '#fff' }}>
                                            <td style={{ padding: '10px 12px', color: '#999', fontFamily: 'monospace' }}>#{anime.id}</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                {anime.mal_id ? (
                                                    <a href={`https://myanimelist.net/anime/${anime.mal_id}`} target="_blank"
                                                        style={{ color: '#2e51a2', textDecoration: 'none', fontFamily: 'monospace' }}>
                                                        {anime.mal_id}
                                                    </a>
                                                ) : (<span style={{ color: '#ccc' }}>--</span>)}
                                            </td>
                                            <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#333' }}>{anime.title}</td>
                                            <td style={{ padding: '10px 12px', color: '#666' }}>{seasons.length} sezon</td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ color: isComplete ? '#3b5323' : '#b45309', fontWeight: 'bold' }}>
                                                    {uploaded}/{totalEps}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', color: '#888', fontSize: '12px' }}>{anime.created_at ? new Date(anime.created_at).toLocaleDateString('tr-TR') : '--'}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <a href={`/archive/${anime.id}`} class="btn btn-small" style={{ fontSize: '11px', padding: '3px 8px', textDecoration: 'none', background: 'linear-gradient(to bottom,#f5f5f5,#ddd)', color: '#333', borderColor: '#aaa', textShadow: 'none', marginRight: '5px' }}>Detay</a>
                                                {!isComplete && (
                                                    <a href={`/upload?anime_id=${anime.id}`} class="btn btn-small" style={{ fontSize: '11px', padding: '3px 8px', textDecoration: 'none', background: 'linear-gradient(to bottom, #7ba05b 0%, #5a7d3c 100%)', marginRight: '5px' }}>Bolum Ekle</a>
                                                )}
                                                <button class="btn btn-small" style={{ fontSize: '11px', padding: '3px 8px', background: 'linear-gradient(to bottom,#dc6969,#b22222)', color: '#fff', borderColor: '#8b0000', textShadow: 'none' }}
                                                    onclick={`if(confirm('${anime.title} arsivden silinsin mi?')) deleteAnime(${anime.id})`}>Sil</button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Notification Toast */}
            <div id="copy-toast" style={{
                display: 'none', position: 'fixed', bottom: '20px', right: '20px',
                backgroundColor: '#f9f6f0', border: '1px solid #c2bba8', borderLeft: '4px solid #6b8e23',
                borderRadius: '4px', padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontSize: '13px', color: '#333', zIndex: 9999, minWidth: '200px'
            }}>
                <strong>Bilgi:</strong> <span id="copy-toast-msg">URL kopyalandi!</span>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', backgroundColor: '#6b8e23', width: '100%', animation: 'toast-progress-anim 3s linear forwards' }}></div>
            </div>

            {html`
            <script>
                function showCopyToast(msg) {
                    const t = document.getElementById('copy-toast');
                    document.getElementById('copy-toast-msg').innerText = msg || 'URL kopyalandi!';
                    t.style.display = 'block';
                    setTimeout(() => { t.style.display = 'none'; }, 2500);
                }

                function deleteAnime(id) {
                    fetch('/api/v1/upload/anime/' + id, { method: 'DELETE' })
                        .then(res => res.json())
                        .then(res => {
                            if(res.status === 'ok') {
                                showCopyToast('Anime silindi.');
                                setTimeout(() => window.location.reload(), 500);
                            } else {
                                alert('Silme basarisiz.');
                            }
                        })
                        .catch(e => alert('Istek hatasi: ' + e.message));
                }
            </script>
            `}
        </Layout>
    );
};
