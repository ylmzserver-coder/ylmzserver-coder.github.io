// LUMIO - Gemini proxy (Netlify Function). Anahtar SADECE sunucuda (GEMINI_API_KEY ortam değişkeni).
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const ADAY_MODELLER = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
let secilenModel = null;      // sıcak sunucuda önbellek
let modelListeZamani = 0;

const CORS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};
const yanit = (kod, obj) => ({ statusCode: kod, headers: CORS, body: JSON.stringify(obj) });

async function zamanAsimliFetch(url, opts, ms = 25000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try { return await fetch(url, { ...opts, signal: c.signal }); }
  finally { clearTimeout(t); }
}

// Google'ın o an gerçekten sunduğu flash modellerini bul (model adları sık değişiyor)
async function kullanilabilirModeller(key) {
  const liste = [];
  if (secilenModel) liste.push(secilenModel);
  ADAY_MODELLER.forEach(m => { if (!liste.includes(m)) liste.push(m); });
  if (Date.now() - modelListeZamani > 6 * 3600 * 1000) {
    try {
      const r = await zamanAsimliFetch(`${BASE}/models?pageSize=200&key=${key}`, {}, 8000);
      const d = await r.json();
      (d.models || [])
        .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map(m => m.name.replace('models/', ''))
        .filter(n => /flash/.test(n) && !/(image|tts|live|thinking|exp|preview|embed)/.test(n))
        .forEach(n => { if (!liste.includes(n)) liste.push(n); });
      modelListeZamani = Date.now();
    } catch (e) { /* liste alınamazsa aday modellerle devam */ }
  }
  return liste.slice(0, 6);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return yanit(405, { hata: 'Sadece POST' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return yanit(500, { hata: 'Sunucuda GEMINI_API_KEY tanımlı değil (Netlify > Site settings > Environment variables).' });

  let govde;
  try { govde = JSON.parse(event.body || '{}'); } catch { return yanit(400, { hata: 'Geçersiz JSON' }); }
  if (!govde.payload || !Array.isArray(govde.payload.contents)) return yanit(400, { hata: 'payload.contents gerekli' });
  if ((event.body || '').length > 4_000_000) return yanit(413, { hata: 'İstek çok büyük' });

  const modeller = await kullanilabilirModeller(key);
  let sonHata = 'Bilinmeyen hata';
  for (const model of modeller) {
    try {
      const r = await zamanAsimliFetch(`${BASE}/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(govde.payload)
      });
      const d = await r.json();
      const metin = d?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      if (r.ok && metin) { secilenModel = model; return yanit(200, { metin, model }); }
      sonHata = d?.error?.message || (d?.promptFeedback ? 'İçerik güvenlik filtresine takıldı' : `HTTP ${r.status}`);
      if (r.status === 400 || r.status === 403 || r.status === 429) {
        // anahtar/kota/istek hatası: başka model denemek çözmez
        if (r.status !== 400 || !/model/i.test(sonHata)) return yanit(r.status, { hata: sonHata });
      }
      if (r.status === 404) secilenModel = null;
    } catch (e) {
      sonHata = e.name === 'AbortError' ? 'Zaman aşımı' : (e.message || 'Bağlantı hatası');
    }
  }
  return yanit(502, { hata: sonHata });
};
