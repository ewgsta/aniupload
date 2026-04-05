import type { FC } from 'hono/jsx';
import { Layout } from '../components/Layout.js';
import { html } from 'hono/html';

export const Upload: FC<{ username: string, savedAnimes?: any[] }> = ({ username, savedAnimes = [] }) => {
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

                    {/* Kayıtlı Animeler / Arşiv Arama */}
                    {savedAnimes.length > 0 && (
                        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #c2bba8', marginBottom: '15px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#3b5323', display: 'block', marginBottom: '5px' }}>Daha Once Eklenenlerden Sec</label>
                            <div id="combo-box" style={{ position: 'relative' }}>
                                <div id="combo-trigger" class="form-input" onclick="toggleCombo()" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                                    <span id="combo-label" style={{ color: '#888' }}>Anime secin...</span>
                                    <span style={{ color: '#666', fontSize: '10px' }}>&#9660;</span>
                                </div>
                                <div id="combo-panel" style={{ display: 'none', position: 'absolute', left: 0, right: 0, top: '100%', marginTop: '2px', backgroundColor: '#fff', border: '1px solid #c2bba8', borderRadius: '0 0 4px 4px', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', zIndex: 200, overflow: 'hidden' }}>
                                    <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                                        <input type="text" id="combo-search" class="form-input" placeholder="Ara..." autocomplete="off" oninput="filterComboItems()" style={{ fontSize: '12px', padding: '6px 8px' }} />
                                    </div>
                                    <div id="combo-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                            <p id="no-season-text" style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', margin: '5px 0' }}>Henüz sezon eklenmemiş.</p>
                        </div>
                    </div>

                    <button class="btn btn-auto" onclick="nextStep(2)">İleri: Bölüm Seçimi &gt;</button>
                </div>

                {/* STEP 2 */}
                <div id="step-2" class="upload-step" style={{ display: 'none' }}>
                    <h3 style={{ marginBottom: '15px', color: '#3b5323' }}>Hedef Bölüm</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div class="form-group" style={{ flex: 1 }}>
                            <label>Sezon Seçin</label>
                            <select id="target-season" class="form-input" onchange="updateEpisodeDropdown()">
                                <option value="">Önce Aşama 1'i Doldurun</option>
                            </select>
                        </div>
                        <div class="form-group" style={{ flex: 1 }}>
                            <label>Bölüm Seçin</label>
                            <select id="target-episode" class="form-input" disabled>
                                <option value="">Sezon Seçin</option>
                            </select>
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
                    <button class="btn btn-auto" style={{ marginLeft: '10px', background: 'linear-gradient(to bottom, #b22222, #8b0000)', borderColor: '#5c0000', color: '#fff' }} onclick="startUpload()">Islemi Baslat</button>
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
                function updateEpisodeDropdown() {
                    const seasonSelect = document.getElementById('target-season');
                    const epSelect = document.getElementById('target-episode');
                    
                    if (!seasonSelect.value) {
                        epSelect.disabled = true;
                        epSelect.innerHTML = '<option value="">Sezon Seçin</option>';
                        return;
                    }
                    
                    const opt = seasonSelect.options[seasonSelect.selectedIndex];
                    const maxEps = parseInt(opt.getAttribute('data-eps')) || 0;
                    
                    epSelect.innerHTML = '<option value="">-- Bölüm Seç --</option>';
                    for(let i=1; i<=maxEps; i++) {
                        epSelect.innerHTML += '<option value="' + i + '">Bölüm ' + i + '</option>';
                    }
                    epSelect.disabled = false;
                }

                function nextStep(step) {
                    if (step === 2) {
                        const seasonsConfig = [];
                        const rows = document.querySelectorAll('.season-row');
                        rows.forEach((row, index) => {
                            const eps = row.querySelector('.season-episodes-input').value;
                            seasonsConfig.push({ index: index + 1, eps: parseInt(eps) || 0 });
                        });
                        
                        const seasonSelect = document.getElementById('target-season');
                        seasonSelect.innerHTML = '';
                        if (seasonsConfig.length === 0) {
                            seasonSelect.innerHTML = '<option value="">Önce Sezon Ekleyin</option>';
                            document.getElementById('target-episode').innerHTML = '<option value="">-</option>';
                            document.getElementById('target-episode').disabled = true;
                        } else {
                            seasonSelect.innerHTML = '<option value="">-- Sezon Seç --</option>';
                            seasonsConfig.forEach(s => {
                                seasonSelect.innerHTML += '<option value="' + s.index + '" data-eps="' + s.eps + '">Sezon ' + s.index + '</option>';
                            });
                            document.getElementById('target-episode').disabled = true;
                            document.getElementById('target-episode').innerHTML = '<option value="">Önce Sezon Seçin</option>';
                        }
                    }

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

                let seasonCount = 0;
                
                const savedAnimes = ${JSON.stringify(savedAnimes)};
                
                function fillFromSavedAnime(data) {
                    document.getElementById('anime-title').value = data.title;
                    document.getElementById('mal-id').value = data.mal_id || '';
                    
                    const container = document.getElementById('seasons-container');
                    container.innerHTML = '';
                    seasonCount = 0;
                    
                    try {
                        const seasons = JSON.parse(data.seasons_data || '[]');
                        if(seasons.length > 0) {
                            seasons.forEach(s => {
                                const row = addSeasonRow();
                                row.querySelector('.season-episodes-input').value = s.episodes;
                            });
                        } else {
                            reindexSeasons();
                        }
                    } catch(e) {
                         reindexSeasons();
                    }
                    // Fetch completed status message update
                    const status = document.getElementById('mal-status');
                    status.style.display = 'block';
                    status.innerText = "Lokal veritabanından başarıyla yüklendi! (" + data.title + ")";
                    status.style.color = "#3b5323";
                }

                function handleSavedSelect(title) {
                    const anime = savedAnimes.find(a => a.title === title);
                    if(anime) {
                        document.getElementById('combo-label').innerText = title;
                        document.getElementById('combo-label').style.color = '#333';
                        document.getElementById('combo-panel').style.display = 'none';
                        fillFromSavedAnime(anime);
                    }
                }

                let comboOpen = false;
                function toggleCombo() {
                    comboOpen = !comboOpen;
                    const panel = document.getElementById('combo-panel');
                    if (comboOpen) {
                        panel.style.display = 'block';
                        renderComboItems(savedAnimes);
                        const search = document.getElementById('combo-search');
                        search.value = '';
                        setTimeout(() => search.focus(), 50);
                    } else {
                        panel.style.display = 'none';
                    }
                }

                function filterComboItems() {
                    const val = document.getElementById('combo-search').value.toLowerCase();
                    const filtered = savedAnimes.filter(a => a.title.toLowerCase().includes(val));
                    renderComboItems(filtered);
                }

                function renderComboItems(items) {
                    const list = document.getElementById('combo-list');
                    if (items.length === 0) {
                        list.innerHTML = '<div style="padding:12px; color:#888; font-style:italic; text-align:center; font-size:12px;">Sonuc bulunamadi</div>';
                        return;
                    }
                    list.innerHTML = items.map(a =>
                        '<div style="padding:8px 12px; cursor:pointer; border-bottom:1px solid #f5f5f0; font-size:13px; transition:background 0.15s;" ' +
                        'onmouseover="this.style.backgroundColor=\'#eef5e5\'" onmouseout="this.style.backgroundColor=\'#fff\'" ' +
                        'onclick="handleSavedSelect(\'' + a.title.replace(/'/g, "\\'") + '\')">' +
                        '<strong>' + a.title + '</strong>' +
                        (a.mal_id ? ' <span style="color:#999; font-size:11px;">(MAL: ' + a.mal_id + ')</span>' : '') +
                        '</div>'
                    ).join('');
                }

                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    const box = document.getElementById('combo-box');
                    if (box && !box.contains(e.target)) {
                        document.getElementById('combo-panel').style.display = 'none';
                        comboOpen = false;
                    }
                });

                function addSeasonRow() {
                    const noSeasonText = document.getElementById('no-season-text');
                    if(noSeasonText) noSeasonText.style.display = 'none';

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
                    row.innerHTML = '<strong class="season-label" style="color: #666; font-size: 13px; min-width: 60px;">Sezon ' + seasonCount + '</strong>' +
                                    '<input type="number" class="form-input season-episodes-input" value="12" min="1" placeholder="Bölüm" style="flex: 1;" />' +
                                    '<span style="font-size: 13px; color: #999;">Bölüm</span>' +
                                    '<button type="button" style="background: transparent; color: #991b1b; border: none; padding: 0; cursor: pointer; font-size: 14px; width: 20px;" onclick="removeSeasonRow(this)" title="Sil">✖</button>';
                    container.appendChild(row);
                    return row;
                }

                function removeSeasonRow(btn) {
                    btn.parentNode.remove();
                    reindexSeasons();
                }

                function reindexSeasons() {
                    const rows = document.querySelectorAll('.season-row');
                    seasonCount = rows.length;
                    
                    if (seasonCount === 0) {
                        const noSeasonText = document.getElementById('no-season-text');
                        if(noSeasonText) noSeasonText.style.display = 'block';
                    }

                    rows.forEach((row, index) => {
                        const label = row.querySelector('.season-label');
                        if (label) label.innerText = 'Sezon ' + (index + 1);
                    });
                }

                function fetchMalData() {
                    const malId = document.getElementById('mal-id').value;
                    if(!malId) return;
                    
                    const status = document.getElementById('mal-status');
                    
                    // Local DB Check First
                    const existing = savedAnimes.find(a => String(a.mal_id) === malId);
                    if(existing) {
                        fillFromSavedAnime(existing);
                        return;
                    }

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
                                    if(seasonCount === 0) addSeasonRow();
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
                    const selectedSeason = document.getElementById('target-season').value;
                    const selectedEpisode = document.getElementById('target-episode').value;

                    if (!title) {
                        alert("HATA: Lütfen ilk aşamadan Anime Adını girin.");
                        nextStep(1);
                        return;
                    }
                    if (seasonCount === 0) {
                        alert("HATA: Lütfen ilk aşamadan en az 1 sezon ekleyin.");
                        nextStep(1);
                        return;
                    }
                    if (!selectedSeason || !selectedEpisode) {
                        alert("HATA: Lütfen yüklenecek Sezon ve Bölümü Aşama 2'den seçin.");
                        nextStep(2);
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
                    
                    const malId = document.getElementById('mal-id').value;

                    const selectedServers = [];
                    document.querySelectorAll('.server-cb:checked').forEach(cb => selectedServers.push(cb.value));
                    const servicesObj = {};
                    selectedServers.forEach(s => servicesObj[s] = 'https://' + s + '.mock/video/' + Math.random().toString(36).substring(7));

                    fetch('/api/v1/upload/metadata', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            title: title,
                            mal_id: malId,
                            seasons_data: JSON.stringify(seasonsData),
                            target_season: selectedSeason,
                            target_episode: selectedEpisode,
                            services: JSON.stringify(servicesObj)
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
