import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';
import { html } from 'hono/html';

export const Upload: FC<{ username: string }> = ({ username }) => {
    return (
        <Layout title="AniUpload - Yeni Anime Yükle">
            <nav class="transparent-nav">
                <h2>AniUpload Arşivi - Yükleme Merkezi</h2>
                <div class="nav-user-area">
                    <span style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.8)" }}>Oturum: {username}</span>
                    <a href="/dashboard" class="btn btn-small" style={{ textDecoration: 'none', background: '#dcdcdc', color: '#333' }}>Panele Dön</a>
                </div>
            </nav>

            <div class="dashboard-container" style={{ maxWidth: '900px' }}>
                <div class="steps-indicator" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px', fontSize: '14px' }}>
                    <div id="ind-step-1" style={{ fontWeight: 'bold', color: '#6b8e23' }}>1. Anime Bilgisi</div>
                    <div id="ind-step-2" style={{ color: '#999' }}>2. Sezon/Bölüm</div>
                    <div id="ind-step-3" style={{ color: '#999' }}>3. Dosya Seçimi</div>
                    <div id="ind-step-4" style={{ color: '#999' }}>4. Hedef Servisler</div>
                </div>

                {/* STEP 1 */}
                <div id="step-1" class="upload-step">
                    <h3 style={{ marginBottom: '15px', color: '#3b5323' }}>Anime Bilgisi</h3>

                    {/* MAL ID Fethcer */}
                    <div style={{ backgroundColor: '#eef5e5', padding: '15px', borderRadius: '4px', border: '1px solid #c2bba8', marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#3b5323', display: 'block', marginBottom: '5px' }}>MyAnimeList'ten Veri Çek</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" id="mal-id" class="form-input" placeholder="MAL Anime ID (Örn: 20)" style={{ flex: 1 }} />
                            <button class="btn btn-small" type="button" onclick="fetchMalData()" id="mal-btn">Otomatik Doldur</button>
                        </div>
                        <div id="mal-status" style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'none' }}></div>
                    </div>

                    <div class="form-group">
                        <label>Anime Adı (Örn: Naruto Shippuden)</label>
                        <input type="text" id="anime-title" class="form-input" placeholder="Anime ismini girin..." />
                    </div>

                    <div class="form-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span>Sezon Yapılandırması</span>
                            <button class="btn btn-small" onclick="addSeasonRow()" type="button" style={{ margin: 0, padding: '4px 10px', background: '#dcdcdc', color: '#333', borderColor: '#ccc', textShadow: 'none' }}>+ Yeni Sezon Ekle</button>
                        </label>

                        <div id="seasons-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div class="season-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                                <strong style={{ color: '#666', fontSize: '13px', minWidth: '60px' }}>Sezon 1</strong>
                                <input type="number" class="form-input season-episodes-input" value="12" min="1" placeholder="Bölüm" style={{ flex: 1 }} />
                                <span style={{ fontSize: '13px', color: '#999' }}>Bölüm</span>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-auto" onclick="nextStep(2)">İleri: Bölüm Seçimi &gt;</button>
                </div>

                {/* STEP 2 */}
                <div id="step-2" class="upload-step" style={{ display: 'none' }}>
                    <h3 style={{ marginBottom: '15px', color: '#3b5323' }}>Hedef Bölüm</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div class="form-group" style={{ flex: 1 }}>
                            <label>Hangi Sezon Yüklenecek?</label>
                            <input type="number" id="target-season" class="form-input" value="1" min="1" />
                        </div>
                        <div class="form-group" style={{ flex: 1 }}>
                            <label>Hangi Bölüm Yüklenecek?</label>
                            <input type="number" id="target-episode" class="form-input" value="1" min="1" />
                        </div>
                    </div>
                    <button class="btn btn-auto" style={{ background: 'linear-gradient(to bottom, #999, #777)', borderColor: '#555' }} onclick="nextStep(1)">&lt; Geri</button>
                    <button class="btn btn-auto" style={{ marginLeft: '10px' }} onclick="nextStep(3)">İleri: Video Yükleme &gt;</button>
                </div>

                {/* STEP 3 */}
                <div id="step-3" class="upload-step" style={{ display: 'none' }}>
                    <h3 style={{ marginBottom: '15px', color: '#3b5323' }}>Video Dosyası</h3>
                    <div id="drop-zone" style={{ border: '2px dashed #a9a9a9', padding: '40px', textAlign: 'center', backgroundColor: '#fdfdfd', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
                        <p style={{ color: '#666', pointerEvents: 'none' }}>Videoyu buraya sürükleyin veya <strong style={{ color: '#3b5323' }}>tıklayarak seçin</strong>.</p>
                        <input type="file" id="video-file" style={{ display: 'none' }} accept="video/mp4,video/mkv,video/avi" />
                        <p id="file-name" style={{ marginTop: '10px', fontWeight: 'bold', color: '#16480e' }}></p>
                    </div>
                    <button class="btn btn-auto" style={{ background: 'linear-gradient(to bottom, #999, #777)', borderColor: '#555' }} onclick="nextStep(2)">&lt; Geri</button>
                    <button class="btn btn-auto" id="btn-to-4" style={{ marginLeft: '10px' }} onclick="nextStep(4)">İleri: Servisler &gt;</button>
                </div>

                {/* STEP 4 */}
                <div id="step-4" class="upload-step" style={{ display: 'none' }}>
                    <h3 style={{ marginBottom: '15px', color: '#3b5323' }}>Hedef Servisler (Mock)</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Videonun yansıtılacağı (mirror) sunucuları seçin.</p>

                    <div style={{ marginBottom: '15px' }}>
                        <button class="btn btn-small" onclick="selectAllServers()" style={{ background: '#eee', color: '#333', borderColor: '#ccc' }}>Hepsini Seç</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                            <input type="checkbox" class="server-cb" value="sibnet" /> Sibnet
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                            <input type="checkbox" class="server-cb" value="mailru" /> Mail.ru
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                            <input type="checkbox" class="server-cb" value="mp4upload" /> MP4Upload
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                            <input type="checkbox" class="server-cb" value="okru" /> OK.ru
                        </label>
                    </div>

                    <button class="btn btn-auto" style={{ background: 'linear-gradient(to bottom, #999, #777)', borderColor: '#555' }} onclick="nextStep(3)">&lt; Geri</button>
                    <button class="btn btn-auto" style={{ marginLeft: '10px', background: 'linear-gradient(to bottom, #b22222, #8b0000)', borderColor: '#5c0000', color: '#fff' }} onclick="startUpload()">🚀 İşlemi Başlat</button>
                </div>
            </div>

            {/* Persistent Progress Toast UI */}
            <div id="progress-toast" style={{
                display: 'none', position: 'fixed', bottom: '20px', left: '50%', marginLeft: '-175px',
                backgroundColor: '#f9f6f0', border: '1px solid #c2bba8', borderTop: '4px solid #3b5323',
                padding: '15px 20px', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 10000, width: '350px', transform: 'scale(1)', transition: 'transform 0.3s ease'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ color: '#3b5323' }} id="pt-title">Yükleniyor...</strong>
                    <span id="pt-percent" style={{ fontWeight: 'bold' }}>0%</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ccc' }}>
                    <div id="pt-bar" style={{ width: '0%', height: '100%', bottom: 0, padding: 0, animation: 'none', backgroundColor: '#6b8e23', transition: 'width 0.4s ease' }}></div>
                </div>
                <p id="pt-desc" style={{ fontSize: '12px', color: '#4a4a4a', marginTop: '10px', fontWeight: 'bold' }}>Metadata kaydediliyor...</p>
                <button id="pt-close" onclick="closeProgressToast()" class="btn btn-small" style={{ display: 'none', marginTop: '15px', background: 'linear-gradient(to bottom, #7ba05b 0%, #5a7d3c 100%)', width: '100%' }}>Tamamla ve Panele Dön</button>
            </div>

            {html`
            <script>
                function nextStep(step) {
                    for(let i=1; i<=4; i++) {
                        document.getElementById('step-'+i).style.display = (i === step) ? 'block' : 'none';
                        document.getElementById('ind-step-'+i).style.color = (i === step) ? '#6b8e23' : '#999';
                        document.getElementById('ind-step-'+i).style.fontWeight = (i === step) ? 'bold' : 'normal';
                    }
                }

                const dropZone = document.getElementById('drop-zone');
                const fileInput = document.getElementById('video-file');
                const fileName = document.getElementById('file-name');

                dropZone.addEventListener('click', () => fileInput.click());
                
                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropZone.style.backgroundColor = '#eef5e5';
                });
                
                dropZone.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    dropZone.style.backgroundColor = '#fdfdfd';
                });

                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropZone.style.backgroundColor = '#fdfdfd';
                    if (e.dataTransfer.files.length) {
                        fileInput.files = e.dataTransfer.files;
                        fileName.innerText = "Seçili dosya: " + e.dataTransfer.files[0].name;
                    }
                });

                fileInput.addEventListener('change', () => {
                    if (fileInput.files.length) {
                        fileName.innerText = "Seçili dosya: " + fileInput.files[0].name;
                    }
                });

                function selectAllServers() {
                    document.querySelectorAll('.server-cb').forEach(cb => cb.checked = true);
                }

                let seasonCount = 1;
                function addSeasonRow() {
                    seasonCount++;
                    const container = document.getElementById('seasons-container');
                    const row = document.createElement('div');
                    row.className = 'season-row';
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.gap = '10px';
                    row.style.background = '#fff';
                    row.style.border = '1px solid #eee';
                    row.style.padding = '10px';
                    row.style.borderRadius = '4px';
                    row.innerHTML = '<strong style="color: #666; font-size: 13px; min-width: 60px;">Sezon ' + seasonCount + '</strong>' +
                                    '<input type="number" class="form-input season-episodes-input" value="12" min="1" placeholder="Bölüm" style="flex: 1;" />' +
                                    '<span style="font-size: 13px; color: #999;">Bölüm</span>';
                    container.appendChild(row);
                }

                function fetchMalData() {
                    const malId = document.getElementById('mal-id').value;
                    if(!malId) return;
                    const status = document.getElementById('mal-status');
                    status.style.display = 'block';
                    status.innerText = "Jikan API'den bilgi çekiliyor...";
                    status.style.color = "#666";
                    document.getElementById('mal-btn').disabled = true;

                    fetch('https://api.jikan.moe/v4/anime/' + malId)
                        .then(res => res.json())
                        .then(res => {
                            document.getElementById('mal-btn').disabled = false;
                            if(res.data) {
                                document.getElementById('anime-title').value = res.data.title || res.data.title_english || '';
                                if(res.data.episodes) {
                                    const epsInput = document.querySelector('.season-episodes-input');
                                    if(epsInput) epsInput.value = res.data.episodes;
                                }
                                status.innerText = "Başarıyla dolduruldu! (" + res.data.title + ")";
                                status.style.color = "#3b5323";
                            } else {
                                status.innerText = "Veri bulunamadı, ID'yi kontrol edin.";
                                status.style.color = "#991b1b";
                            }
                        })
                        .catch(e => {
                            document.getElementById('mal-btn').disabled = false;
                            status.innerText = "Jikan API'ye ulaşılamadı.";
                            status.style.color = "#991b1b";
                        });
                }

                function startUpload() {
                    const title = document.getElementById('anime-title').value;
                    if (!title) {
                        alert("HATA: Lütfen ilk aşamadan Anime Adını girin.");
                        nextStep(1);
                        return;
                    }
                    if (!fileInput.files.length) {
                        alert("HATA: Lütfen üçüncü aşamadan video dosyasını seçin.");
                        nextStep(3);
                        return;
                    }
                    
                    const servers = document.querySelectorAll('.server-cb:checked');
                    if (servers.length === 0) {
                        alert("Lütfen en az bir sunucu seçin.");
                        return;
                    }

                    // Progress UI aktif et
                    const progressToast = document.getElementById('progress-toast');
                    const ptBar = document.getElementById('pt-bar');
                    const ptPercent = document.getElementById('pt-percent');
                    const ptDesc = document.getElementById('pt-desc');
                    const ptClose = document.getElementById('pt-close');
                    const ptTitle = document.getElementById('pt-title');

                    progressToast.style.display = 'block';
                    progressToast.style.transform = 'scale(1.1)'; 
                    setTimeout(() => progressToast.style.transform = 'scale(1)', 300);

                    // API Call
                    const epsInputs = document.querySelectorAll('.season-episodes-input');
                    const seasonsData = [];
                    epsInputs.forEach((input, index) => {
                        seasonsData.push({ season: index + 1, episodes: parseInt(input.value) || 1 });
                    });
                    
                    fetch('/api/v1/upload/metadata', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            title: title,
                            seasons_data: JSON.stringify(seasonsData)
                        })
                    }).catch(console.error);

                    // Mock Progress
                    let progress = 0;
                    document.querySelector('#step-4 button[onclick="startUpload()"]').disabled = true;
                    
                    const interval = setInterval(() => {
                        progress += Math.floor(Math.random() * 8) + 4;
                        if (progress > 100) progress = 100;
                        
                        ptPercent.innerText = progress + '%';
                        ptBar.style.width = progress + '%';

                        if (progress > 20 && progress < 80) {
                            ptDesc.innerText = "Video parçalanıyor ve " + servers.length + " sunucuya aktarılıyor...";
                        } else if (progress >= 80 && progress < 100) {
                            ptDesc.innerText = "Son ayarlamalar yapılıyor (İndeksleme)...";
                        }

                        if (progress === 100) {
                            clearInterval(interval);
                            ptTitle.innerText = "İşlem Tamamlandı!";
                            ptDesc.innerText = title + " başarıyla tüm sunuculara aktarıldı.";
                            ptClose.style.display = 'block';
                            
                            // Native toast popup effect fallback
                            const nt = document.createElement('div');
                            nt.style.position = 'fixed'; nt.style.top = '20px'; nt.style.right = '20px';
                            nt.style.background = '#6b8e23'; nt.style.color = '#fff'; nt.style.padding = '10px 20px';
                            nt.style.borderRadius = '4px'; nt.style.zIndex = '99999'; nt.innerText = 'Tamamlandı!';
                            document.body.appendChild(nt);
                            setTimeout(() => nt.remove(), 3000);
                        }
                    }, 600);
                }

                function closeProgressToast() {
                    document.getElementById('progress-toast').style.display = 'none';
                    window.location.href = '/dashboard?success=true';
                }
            </script>
            `}
        </Layout>
    );
};
