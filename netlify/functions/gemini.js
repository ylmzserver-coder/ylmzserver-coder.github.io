// LUMIO - Gemini proxy (Netlify Function). Anahtar SADECE sunucuda (GEMINI_API_KEY).
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const ADAY_MODELLER = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
let secilenModel = null;
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
    } catch (e) { /* Hata durumunda aday modellerle devam */ }
  }
  return liste.slice(0, 6);
}

// 40 Yıllık Kıdemli Usta ve Colorist Karakter Talimatı
const USTA_SYSTEM_INSTRUCTION = {
  parts: [{
    text: "Sen LUMIO Terminal'in arkasında duran, 40 yıllık tecrübeye sahip kıdemli bir salon patronu ve master colorist ustasın. Karşındaki kişi senin meslektaşın (kuaför, tırnak uzmanı, güzellik uzmanı veya salon patronu). Asla robotik veya yapay zeka jargonu kullanma. Doğrudan dükkan diliyle, samimi, saygılı ve usta lisanıyla konuş ('Ustam', 'Kardeşim'). Kuaförlük kimyasını (oryal, oksidan, cila, porozite vb.) ezbere bilirsin. Asla yıldız (**), diyez (#) veya markdown işaretleri kullanma. Düz ve net Türkçe ile cevap ver."
  }]
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return yanit(405, { hata: 'Sadece POST' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return yanit(500, { hata: 'Sunucuda GEMINI_API_KEY tanımlı değil.' });

  let govde;
  try { govde = JSON.parse(event.body || '{}'); } catch { return yanit(400, { hata: 'Geçersiz JSON' }); }
  if (!govde.payload || !Array.isArray(govde.payload.contents)) return yanit(400, { hata: 'payload.contents gerekli' });

  // Usta karakterini her isteğe sistem talimatı olarak enjekte ediyoruz
  if (!govde.payload.system_instruction) {
    govde.payload.system_instruction = USTA_SYSTEM_INSTRUCTION;
  }

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
        if (r.status !== 400 || !/model/i.test(sonHata)) return yanit(r.status, { hata: sonHata });
      }
      if (r.status === 404) secilenModel = null;
    } catch (e) {
      sonHata = e.name === 'AbortError' ? 'Zaman aşımı' : (e.message || 'Bağlantı hatası');
    }
  }
  return yanit(502, { hata: sonHata });
};
