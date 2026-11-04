const AI_ENDPOINT = '/.netlify/functions/gemini';

async function geminiApiCagir(payload) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 45000);
  try {
    const r = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload }),
      signal: c.signal
    });
    let d = {};
    try { d = await r.json(); } catch (_) {}
    if (!r.ok || !d.metin) throw new Error(d.hata || ('Yapay zeka yanıt vermedi (HTTP ' + r.status + ')'));
    return d.metin;
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'Yapay zeka zaman aşımına uğradı.' : e.message);
  } finally { clearTimeout(t); }
}

function aiJsonAyikla(ham) {
  const s = String(ham || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b < a) throw new Error('Yapay zeka geçerli JSON döndürmedi.');
  return JSON.parse(s.slice(a, b + 1));
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function guvenliUrl(u) { return /^https?:\/\//i.test(String(u || '')) ? String(u) : '#'; }

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
