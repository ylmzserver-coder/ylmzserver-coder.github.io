/* ==========================================================================
   LUMIO - BÖLGEYE GÖRE YASAL METİNLER (legal.js)
   Bölgeler: TR (Türkiye/KVKK), EU (GDPR), UK (UK GDPR), US (ABD), GLOBAL (diğer)
   Sürüm: 2026-11-06.1
   ========================================================================== */
(function () {
  'use strict';

  var LEGAL = {
    surum: '2026-11-06.1',
    hukukcuOnayli: false,
    firma: {
      unvan: 'LUMIO Salon Intelligence',
      iletisim: '',
      adres: ''
    }
  };

  var BOLGELER = [
    { kod: 'TR', ad: '🇹🇷 Türkiye (KVKK)' },
    { kod: 'EU', ad: '🇪🇺 Avrupa Birliği (GDPR)' },
    { kod: 'UK', ad: '🇬🇧 United Kingdom (UK GDPR)' },
    { kod: 'US', ad: '🇺🇸 United States' },
    { kod: 'GLOBAL', ad: '🌍 Diğer ülkeler / Other countries' }
  ];

  var AB_KODLARI3 = ['351', '352', '353', '356', '357', '358', '359', '370', '371', '372', '385', '386', '420', '421'];
  var AB_KODLARI2 = ['30', '31', '32', '33', '34', '36', '39', '40', '43', '45', '46', '48', '49'];

  function bolgeTahmin(rakamlar) {
    var d = String(rakamlar || '').replace(/\D/g, '');
    if (!d) return null;
    if (d.indexOf('90') === 0 && d.length >= 11) return 'TR';
    if (d.length === 10 && d.charAt(0) === '5') return 'TR';
    if (AB_KODLARI3.indexOf(d.substr(0, 3)) > -1) return 'EU';
    if (AB_KODLARI2.indexOf(d.substr(0, 2)) > -1) return 'EU';
    if (d.indexOf('44') === 0) return 'UK';
    if (d.charAt(0) === '1') return 'US';
    return 'GLOBAL';
  }

  function iletisimSatiri(dil) {
    var f = LEGAL.firma;
    if (dil === 'tr') return f.iletisim ? ('İletişim: ' + f.iletisim + (f.adres ? ' — ' + f.adres : '') + '.') : 'İletişim için uygulama içindeki yetkili destek kanalını kullanabilirsiniz.';
    return f.iletisim ? ('Contact: ' + f.iletisim + (f.adres ? ' — ' + f.adres : '') + '.') : 'You can contact us through the in-app support channel.';
  }

  /* ------------------------------ TÜRKİYE ------------------------------ */
  function metinTR() {
    var F = LEGAL.firma.unvan;
    return {
      dil: 'tr',
      belgeler: [
        {
          id: 'EULA', baslik: '1. Kullanıcı Lisans ve Hizmet Sözleşmesi',
          maddeler: [
            ['Taraflar ve konu', F + ' ("Sağlayıcı"), güzellik salonları, kuaförler ve berberler için bulut tabanlı randevu, müşteri ve kasa yönetimi uygulamasını ("LUMIO") sunar. Uygulamaya giriş yapan salon sahibi veya usta ("Kullanıcı"), bu sözleşmeyi kabul ederek hizmeti kullanma hakkı kazanır.'],
            ['Lisans kapsamı', 'Sağlayıcı, Kullanıcıya uygulamayı lisans süresi boyunca, devredilemez ve münhasır olmayan biçimde kullanma hakkı verir. Hesabın yetkisiz üçüncü kişilerle paylaşılması veya uygulamanın kaynak kodlarına müdahale edilmesi yasaktır.'],
            ['Hesap güvenliği', 'Giriş bilgileri Kullanıcıya özeldir. Şifrenin gizliliğinden ve hesapla yapılan işlemlerden Kullanıcı sorumludur.'],
            ['Ücret, süre ve lisans bitişi', 'Lisans süresi tamamlanan hesaplarda yeni işlem girişi (randevu, kasa, yapay zeka) durdurulur. Ancak Kullanıcının veri taşınabilirliği hakkı kapsamında, biriktirdiği müşteri rehberini dışa aktarma (yedek alma) imkânı lisans bitiminde de korunur.'],
            ['Teknik destek ve sistem bütünlüğü', 'Sağlayıcı; hizmet sürekliliğini temin etmek, teknik arıza ve hata giderme süreçlerini yürütmek, veri tabanı bütünlüğünü doğrulamak ve Kullanıcının talep edebileceği canlı teknik destek işlemlerini gerçekleştirebilmek amacıyla sistem kayıtlarına yetkili düzeyde salt-okunur (read-only) teknik erişim hakkını saklı tutar.'],
            ['Veri koruma rolleri', 'Kullanıcı kendi müşterileri bakımından "veri sorumlusu"; Sağlayıcı ise altyapıyı sunan "veri işleyen"dir. Müşterilere bilgilendirme yapılması ve ticari mesaj onayları Kullanıcının sorumluluğundadır.'],
            ['Hizmetin niteliği', 'Hizmet makul özen ile sunulur; altyapı sağlayıcıları veya mücbir sebeplerden doğan geçici kesintilerden Sağlayıcı doğrudan sorumlu tutulamaz. Kullanıcının periyodik rehber yedeği alması tavsiye edilir.']
          ]
        },
        {
          id: 'PRIVACY', baslik: '2. KVKK Aydınlatma Metni ve Gizlilik',
          maddeler: [
            ['Veri sorumlusu ve işleyen', 'Salon (Kullanıcı) kendi müşterilerinin verileri bakımından veri sorumlusudur. ' + F + ' ise Kullanıcının hesap verileri bakımından veri sorumlusu, müşteri verileri bakımından veri işleyendir. ' + iletisimSatiri('tr')],
            ['İşlenen veriler', 'Kullanıcı hesap bilgileri, telefon numarası, randevu kayıtları, işlem ve formül notları, kasa hareketleri.'],
            ['Altyapı sağlayıcıları', 'Veritabanı güvenliği için Google Cloud (Firebase Firestore), web dağıtımı için GitHub Pages ve yapay zekâ güvenlik katmanı için Cloudflare altyapıları kullanılmaktadır.'],
            ['Yapay zekâ veri işleme', 'Yapay zekâ özellikleri yalnızca Kullanıcının başlattığı anlık istekteki verileri (metin/fotoğraf) Google Gemini altyapısı üzerinden analiz eder; veriler harici reklam modellerinde kullanılmaz.'],
            ['Haklarınız', 'KVKK m.11 kapsamında dilediğiniz zaman verilerinize erişme, düzeltme ve lisans sona erdiğinde silinmesini talep etme hakkına sahipsiniz.']
          ]
        },
        {
          id: 'AI', baslik: '3. Yapay Zekâ ve Danışmanlık Bildirimi',
          maddeler: [
            ['Danışma niteliğindedir', 'LUMIO AI Asistanı tarafından sunulan saç analizleri, randevu çözümleri ve formül tavsiyeleri birer ön öneridir. Tıbbi veya dermatolojik teşhis niteliği taşımaz; nihai uygulama kararı uzman olan Kullanıcıya aittir.'],
            ['Kimyasal işlem uyarısı', 'Boya ve açıcı gibi kimyasal işlemler öncesinde ürün üreticisinin yama testi ve kullanım talimatları her zaman esas alınmalıdır.']
          ]
        }
      ]
    };
  }

  /* ------------------------------ GLOBAL / EN ------------------------------ */
  function metinEN(bolge) {
    var F = LEGAL.firma.unvan;
    return {
      dil: 'en',
      belgeler: [
        {
          id: 'EULA', baslik: '1. Terms of Service & License Agreement',
          maddeler: [
            ['Parties', F + ' ("Provider") provides LUMIO, a cloud management platform for salons and beauty professionals ("User").'],
            ['License & Expiry', 'The User is granted a non-exclusive license. Upon license expiration, new transaction entries are paused, but the User retains the right to export customer contacts.'],
            ['Technical Support & Integrity', 'The Provider reserves the right to access system records in a read-only technical capacity solely for platform continuity, maintenance, troubleshooting, and assisting the User upon request.'],
            ['Data Roles', 'The User is the Data Controller regarding salon clients; the Provider acts as the Data Processor. Infrastructure is powered by Google Firebase, GitHub, and Cloudflare.']
          ]
        },
        {
          id: 'PRIVACY', baslik: '2. Privacy Notice & GDPR/Global Compliance',
          maddeler: [
            ['Data Processing', 'Salon client appointments, formula notes, and ledger entries are securely encrypted and processed on behalf of the User.'],
            ['AI Processing', 'AI features process text and images via Google Gemini only upon active user requests. No client data is sold or used for public training.'],
            ['Your Rights', 'Users and clients retain full rights to access, rectify, export, and delete their stored data upon notice.']
          ]
        },
        {
          id: 'AI', baslik: '3. AI Advisory Disclaimer',
          maddeler: [
            ['Advisory Only', 'LUMIO AI Assistant provides preliminary recommendations. It does not constitute medical advice. Chemical testing and service safety remain the User\'s responsibility.']
          ]
        }
      ]
    };
  }

  function metin(bolge) {
    return bolge === 'TR' ? metinTR() : metinEN(bolge);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function duzMetin(bolge) {
    var m = metin(bolge), out = [];
    m.belgeler.forEach(function (b) {
      out.push(b.baslik);
      b.maddeler.forEach(function (x, i) { out.push((i + 1) + '. ' + x[0] + ': ' + x[1]); });
    });
    return 'LUMIO-' + bolge + '-' + LEGAL.surum + '\n' + out.join('\n');
  }

  function render(bolge) {
    var m = metin(bolge);
    var html = '';
    m.belgeler.forEach(function (b, bi) {
      html += '<details ' + (bi === 0 ? 'open ' : '') + 'style="background:#050810;border:1px solid #1e293b;border-radius:14px;margin-bottom:8px;overflow:hidden">' +
        '<summary style="cursor:pointer;padding:11px 12px;font-weight:800;color:#f59e0b;font-size:12px;list-style:none">' + esc(b.baslik) + '</summary>' +
        '<div style="padding:2px 12px 12px;font-size:11px;line-height:1.55;color:#cbd5e1">';
      b.maddeler.forEach(function (x, i) {
        html += '<p style="margin:0 0 7px"><b style="color:#e2e8f0">' + (i + 1) + '. ' + esc(x[0]) + '.</b> ' + esc(x[1]) + '</p>';
      });
      html += '</div></details>';
    });
    html += '<p style="font-size:9px;color:#64748b;margin:6px 2px 0">' + (m.dil === 'tr' ? 'Sürüm: ' : 'Version: ') + esc(LEGAL.surum) + ' · ' + esc(bolge) + '</p>';
    return html;
  }

  function hash(metinStr) {
    function basit(s) { var h = 5381, i; for (i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; } return 'djb2-' + (h >>> 0).toString(16); }
    try {
      if (window.crypto && crypto.subtle && window.TextEncoder) {
        return crypto.subtle.digest('SHA-256', new TextEncoder().encode(metinStr)).then(function (buf) {
          return 'sha256-' + Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        }).catch(function () { return basit(metinStr); });
      }
    } catch (e) {}
    return Promise.resolve(basit(metinStr));
  }

  LEGAL.bolgeler = BOLGELER;
  LEGAL.bolgeTahmin = bolgeTahmin;
  LEGAL.metin = metin;
  LEGAL.duzMetin = duzMetin;
  LEGAL.render = render;
  LEGAL.hash = hash;
  window.LEGAL = LEGAL;
})();