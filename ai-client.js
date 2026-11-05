/* LUMIO - AI istemci katmanı.
   Çalışma modları (otomatik seçilir):
   1) AI_WORKER_URL doluysa -> Cloudflare Worker (anahtar sunucuda, önerilen)
   2) Site netlify.app ise  -> Netlify fonksiyonu (anahtar sunucuda)
   3) Aksi halde (örn. GitHub Pages) -> doğrudan Gemini; anahtar bu cihazda saklanır (localStorage). */
const AI_WORKER_URL = 'https://lumio-ai.ylmzserver.workers.dev';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_ADAY_MODELLER = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];

function kodAnahtar(k) { return String(k || '').replace(/\D/g, '').slice(-10); }

function aiRizaVarMi() {
  try {
    if (typeof aktifLisansKodu === 'undefined' || !aktifLisansKodu) return true;
    return localStorage.getItem('lumio_ai_riza_' + kodAnahtar(aktifLisansKodu)) === '1';
  } catch (_) { return true; }
}

function aiModu() {
  if (AI_WORKER_URL) return 'sunucu';
  if (/netlify\.app$/i.test(location.hostname)) return 'netlify';
  return 'dogrudan';
}

/* ---- Cihazda saklanan Gemini anahtarı (yalnızca 'dogrudan' modda) ---- */
function aiAnahtarOku() { try { return localStorage.getItem('lumio_gemini_key') || ''; } catch (_) { return ''; } }
function aiAnahtarGecerliMi(k) { return /^AIza[0-9A-Za-z_\-]{25,}$/.test(k); }
function aiAnahtarSor() {
  const k = (prompt('Gemini API anahtarınızı girin (AIza ile başlar). Bu cihazda saklanır, tekrar sorulmaz:') || '').trim();
  if (!k) return '';
  if (!aiAnahtarGecerliMi(k)) { alert('Bu bir Gemini API anahtarına benzemiyor. "AIza" ile başlayan anahtarı girin.'); return ''; }
  try { localStorage.setItem('lumio_gemini_key', k); } catch (_) {}
  return k;
}
function aiAnahtarDegistir() {
  const var_ = !!aiAnahtarOku();
  const k = (prompt(var_ ? 'Yeni Gemini anahtarı girin (silmek için boş bırakıp Tamam):' : 'Gemini API anahtarınızı girin (AIza ile başlar):') || '').trim();
  if (!k) { if (var_ && confirm('Kayıtlı anahtar bu cihazdan silinsin mi?')) { try { localStorage.removeItem('lumio_gemini_key'); } catch (_) {} alert('Anahtar silindi.'); } return; }
  if (!aiAnahtarGecerliMi(k)) { alert('Geçersiz biçim. "AIza" ile başlamalı.'); return; }
  try { localStorage.setItem('lumio_gemini_key', k); } catch (_) {}
  alert('✅ Anahtar bu cihaza kaydedildi.');
}

async function zamanAsimliFetch(url, opts, ms) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms || 25000);
  try { return await fetch(url, Object.assign({}, opts, { signal: c.signal })); }
  finally { clearTimeout(t); }
}

async function geminiModelListesi(key) {
  const liste = [];
  let secili = ''; try { secili = localStorage.getItem('lumio_gemini_model') || ''; } catch (_) {}
  if (secili) liste.push(secili);
  GEMINI_ADAY_MODELLER.forEach(m => { if (liste.indexOf(m) < 0) liste.push(m); });
  let zaman = 0; try { zaman = parseInt(localStorage.getItem('lumio_gemini_liste_zaman') || '0', 10); } catch (_) {}
  if (Date.now() - zaman > 6 * 3600 * 1000) {
    try {
      const r = await zamanAsimliFetch(GEMINI_BASE + '/models?pageSize=200', { headers: { 'x-goog-api-key': key } }, 8000);
      const d = await r.json();
      (d.models || [])
        .filter(m => (m.supportedGenerationMethods || []).indexOf('generateContent') > -1)
        .map(m => m.name.replace('models/', ''))
        .filter(n => /flash/.test(n) && !/(image|tts|live|thinking|exp|preview|embed)/.test(n))
        .forEach(n => { if (liste.indexOf(n) < 0) liste.push(n); });
      try { localStorage.setItem('lumio_gemini_liste_zaman', String(Date.now())); } catch (_) {}
    } catch (_) { /* aday modellerle devam */ }
  }
  return liste.slice(0, 6);
}

async function geminiDogrudan(payload) {
  let key = aiAnahtarOku() || aiAnahtarSor();
  if (!key) throw new Error('Yapay zeka için Gemini API anahtarı gerekli. İşlemi tekrar başlatıp anahtarı girin.');
  const modeller = await geminiModelListesi(key);
  let sonHata = 'Bilinmeyen hata';
  for (const model of modeller) {
    try {
      const r = await zamanAsimliFetch(GEMINI_BASE + '/models/' + model + ':generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(payload)
      }, 30000);
      const d = await r.json();
      const metin = (((d.candidates || [])[0] || {}).content || {}).parts;
      const t = metin ? metin.map(p => p.text || '').join('') : '';
      if (r.ok && t) { try { localStorage.setItem('lumio_gemini_model', model); } catch (_) {} return t; }
      sonHata = (d.error && d.error.message) || (d.promptFeedback ? 'İçerik güvenlik filtresine takıldı' : 'HTTP ' + r.status);
      if (r.status === 403 || (r.status === 400 && /api key/i.test(sonHata))) {
        try { localStorage.removeItem('lumio_gemini_key'); } catch (_) {}
        throw new Error('Gemini anahtarı geçersiz veya yetkisiz; silindi. Yeniden deneyip doğru anahtarı girin. (' + sonHata + ')');
      }
      if (r.status === 429) throw new Error('Gemini kotası doldu, biraz sonra tekrar deneyin. (' + sonHata + ')');
      if (r.status === 404) { try { localStorage.removeItem('lumio_gemini_model'); } catch (_) {} }
    } catch (e) {
      if (/anahtar|kota/i.test(e.message)) throw e;
      sonHata = e.name === 'AbortError' ? 'Zaman aşımı' : (e.message || 'Bağlantı hatası');
    }
  }
  throw new Error('Yapay zeka yanıt vermedi: ' + sonHata);
}

async function geminiSunucu(url, payload) {
  const r = await zamanAsimliFetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload })
  }, 45000);
  let d = {}; try { d = await r.json(); } catch (_) {}
  if (r.status === 404 || r.status === 405) throw new Error('Yapay zeka sunucusu bu adreste kurulu değil.');
  if (!r.ok || !d.metin) throw new Error(d.hata || ('Yapay zeka yanıt vermedi (HTTP ' + r.status + ')'));
  return d.metin;
}

async function geminiApiCagir(payload) {
  if (!aiRizaVarMi()) {
    throw new Error('Yapay zeka için açık rıza verilmedi. Yeniden girişte rıza kutusunu işaretleyin. / AI consent was not given.');
  }
  try {
    const mod = aiModu();
    if (mod === 'sunucu') return await geminiSunucu(AI_WORKER_URL, payload);
    if (mod === 'netlify') return await geminiSunucu('/.netlify/functions/gemini', payload);
    return await geminiDogrudan(payload);
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Yapay zeka zaman aşımına uğradı.' : e.message);
  }
}

/* Model çıktısından güvenli JSON çıkar (```json sarmalayıcı veya fazladan yazı olsa da) */
function aiJsonAyikla(ham) {
  const s = String(ham || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('Yapay zeka geçerli JSON döndürmedi.');
  return JSON.parse(s.slice(a, b + 1));
}

/* HTML kaçışı: yapay zeka/müşteri metni innerHTML'e girmeden önce */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function guvenliUrl(u) { return /^https?:\/\//i.test(String(u || '')) ? String(u) : '#'; }

/* Yapay zekadan gelen randevu alanlarını doğrula */
function aiRandevuDogrula(c, bugunStr) {
  const saat = /^([01]?\d|2[0-3]):[0-5]\d$/.test(c.saat || '') ? c.saat.padStart(5, '0') : '14:00';
  const tarih = /^\d{2}\.\d{2}\.\d{4}$/.test(c.tarih || '') ? c.tarih : bugunStr;
  const sure = [15, 30, 45, 60, 90, 120, 150, 180].includes(parseInt(c.sure)) ? parseInt(c.sure) : 60;
  return { saat, tarih, sure };
}

function fiyatParse(v) {
  let s = String(v == null ? '' : v).trim().replace(/\s/g, '');
  if (s.includes(',') && s.includes('.')) s = (s.lastIndexOf(',') > s.lastIndexOf('.')) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (s.includes(',')) s = s.replace(',', '.');
  return parseFloat(s) || 0;
}
