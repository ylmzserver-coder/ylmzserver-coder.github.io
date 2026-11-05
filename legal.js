/* ==========================================================================
   LUMIO - BÖLGEYE GÖRE YASAL METİNLER (legal.js)
   Bölgeler: TR (Türkiye/KVKK), EU (GDPR), UK (UK GDPR), US (ABD), GLOBAL (diğer)
   ÖNEMLİ: Bu metinler profesyonel TASLAK'tır. Satışa çıkmadan önce hedef ülkenin
   yetkili bir avukatı tarafından incelenmeli, firma bilgileri doldurulmalı ve
   LEGAL.hukukcuOnayli = true yapılmalıdır. Metin değiştiğinde LEGAL.surum
   güncellenir ve tüm kullanıcılardan yeniden onay istenir.
   ========================================================================== */
(function () {
  'use strict';

  var LEGAL = {
    surum: '2026-11-04.1',
    hukukcuOnayli: false,           // Avukat onayından sonra true yapın (taslak etiketi kalkar)
    firma: {
      unvan: 'LUMIO',               // Sağlayıcının ticari unvanı
      iletisim: '',                 // Örn: destek@firmaniz.com (boşsa uygulama içi destek hattı yazılır)
      adres: ''                     // Örn: açık adres (opsiyonel)
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
    if (dil === 'tr') return f.iletisim ? ('İletişim: ' + f.iletisim + (f.adres ? ' — ' + f.adres : '') + '.') : 'İletişim için uygulama içindeki destek (WhatsApp) hattını kullanabilirsiniz.';
    return f.iletisim ? ('Contact: ' + f.iletisim + (f.adres ? ' — ' + f.adres : '') + '.') : 'You can contact us through the in-app support (WhatsApp) channel.';
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
            ['Taraflar ve konu', F + ' ("Sağlayıcı"), güzellik/kuaför salonları için bulut tabanlı randevu, müşteri ve kasa yönetimi uygulamasını ("LUMIO") sunar. Uygulamaya giriş yapan salon sahibi veya usta ("Kullanıcı"), bu sözleşmeyi kabul ederek hizmeti kullanma hakkı kazanır.'],
            ['Lisans', 'Sağlayıcı, Kullanıcıya uygulamayı lisans süresi boyunca, devredilemez ve münhasır olmayan biçimde kullanma hakkı verir. Hesabın üçüncü kişilerle paylaşılması, uygulamanın kopyalanması, tersine mühendislik yapılması, yetkisiz erişim denenmesi veya hizmetin işleyişine zarar verilmesi yasaktır.'],
            ['Hesap güvenliği', 'Giriş bilgileri (telefon numarası ve şifre) Kullanıcıya özeldir. Şifrenin gizliliğinden ve hesapla yapılan tüm işlemlerden Kullanıcı sorumludur. Yetkisiz erişim şüphesi Sağlayıcıya gecikmeden bildirilmelidir.'],
            ['Ücret, süre ve yenileme', 'Lisans bedeli ve süresi Kullanıcıya ayrıca bildirilir. Süre sonunda veya ödeme yapılmaması halinde erişim durdurulabilir. Kullanıcı, kendi verilerini dışa aktarma imkânını lisans süresi içinde ve süre bitiminden sonraki 30 gün boyunca (yalnızca okuma ve dışa aktarma) kullanabilir.'],
            ['Taraflarının veri koruma rolleri', 'Kullanıcı, kendi müşterilerine ait kişisel veriler bakımından "veri sorumlusu"; Sağlayıcı ise bu verileri Kullanıcı adına barındıran "veri işleyen"dir. Müşterilere aydınlatma yapılması, gerektiğinde açık rıza alınması (özellikle sağlık, alerji, saç/kafa derisi analizi ve fotoğraf verileri) ve WhatsApp/SMS gibi ticari elektronik iletilerde alıcı onayının (6563 sayılı Kanun) alınması Kullanıcının sorumluluğundadır.'],
            ['Kullanıcının yükümlülükleri', 'Kullanıcı; uygulamayı yürürlükteki mevzuata uygun kullanacağını, girdiği verilerin hukuka uygun elde edildiğini, reşit olmayanların verilerini velisinin/vasisinin bilgisi dışında işlemeyeceğini kabul eder.'],
            ['Hizmetin niteliği ve yedekleme', 'Hizmet, makul özen ile "olduğu gibi" sunulur; kesintisiz veya hatasız olacağı taahhüt edilmez. Bakım, altyapı sağlayıcı kesintileri ve mücbir sebepler nedeniyle geçici erişim sorunları yaşanabilir. Kullanıcı, kritik verilerinin düzenli yedeğini almakla yükümlüdür. Teknik destek, güvenlik ve yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili personelimiz, gizlilik yükümlülüğü altında ve yalnızca gerekli ölçüde hesap verilerine erişebilir.'],
            ['Sorumluluğun sınırı', 'Emredici hükümler ve Sağlayıcının kasıt ya da ağır kusuru saklı kalmak üzere, Sağlayıcının sorumluluğu dolaylı zararlar, kâr kaybı ve veri kaybından doğan zararları kapsamaz ve her halde Kullanıcının son 12 ayda ödediği lisans bedeliyle sınırlıdır.'],
            ['Fikri mülkiyet', 'Uygulamanın yazılımı, tasarımı, markası ve içeriği üzerindeki tüm haklar Sağlayıcıya aittir. Kullanıcının girdiği veriler Kullanıcıya aittir.'],
            ['Fesih', 'Taraflar sözleşmeyi yazılı/elektronik bildirimle feshedebilir. Sözleşmenin ihlali halinde Sağlayıcı hesabı askıya alabilir veya kapatabilir. Fesihte, mevzuatın saklama yükümlülükleri saklı kalmak üzere veriler makul sürede silinir veya anonimleştirilir.'],
            ['Değişiklikler', 'Sağlayıcı sözleşme ve metinleri güncelleyebilir. Esaslı değişikliklerde yeni sürüm yayımlanır ve Kullanıcıdan yeniden onay istenir.'],
            ['Delil sözleşmesi', 'Taraflar, bu onaya ilişkin elektronik kayıtların (onay zamanı, sürüm numarası, metin özeti ve cihaz bilgisi) uyuşmazlık halinde HMK m.193 kapsamında delil olarak kullanılabileceğini kabul eder. Tüketici sıfatı taşıyan kullanıcılar için emredici tüketici mevzuatı saklıdır.'],
            ['Uygulanacak hukuk ve yetki', 'Sözleşmeye Türk hukuku uygulanır. Uyuşmazlıklarda Sağlayıcının yerleşim yeri mahkemeleri ve icra daireleri yetkilidir; tüketici sıfatı taşıyanların Tüketici Hakem Heyeti ve Tüketici Mahkemesi başvuru hakları saklıdır.']
          ]
        },
        {
          id: 'PRIVACY', baslik: '2. KVKK Aydınlatma Metni ve Açık Rıza',
          maddeler: [
            ['Veri sorumlusu / işleyen', 'Salon (Kullanıcı) kendi müşterilerinin verileri bakımından veri sorumlusudur. ' + F + ' ise Kullanıcının hesabına ilişkin veriler bakımından veri sorumlusu, Kullanıcının müşteri verileri bakımından veri işleyendir. ' + iletisimSatiri('tr')],
            ['İşlenen veriler', 'Kullanıcı: ad, telefon numarası, lisans ve giriş kayıtları, cihaz/tarayıcı bilgisi, sözleşme onay kaydı. Salon müşterileri: ad, telefon, doğum tarihi, randevu ve ziyaret geçmişi, hizmet ve ücret bilgisi, boya formülleri ve notlar. Kullanıcının girmesi halinde alerji, saç/kafa derisi durumu ve fotoğraf gibi sağlıkla ilgili olabilecek bilgiler (özel nitelikli kişisel veri).'],
            ['İşleme amaçları', 'Randevu ve müşteri yönetimi, kasa takibi, hatırlatma ve bildirimler, lisans ve hesap yönetimi, güvenlik ve hata giderme, yasal yükümlülüklerin yerine getirilmesi, talep halinde yapay zekâ destekli danışma özelliklerinin sunulması.'],
            ['Hukuki sebepler', '6698 sayılı KVKK m.5/2 uyarınca sözleşmenin ifası, hukuki yükümlülük, meşru menfaat; özel nitelikli veriler ve yapay zekâ analizi için m.6 uyarınca açık rıza.'],
            ['Aktarım ve yurt dışı', 'Veriler, altyapı sağlayıcıları olan Google (Firebase/Cloud Firestore; yapay zekâ özellikleri kullanıldığında Google Gemini) ve barındırma sağlayıcısı GitHub ve yapay zekâ isteklerini ileten Cloudflare aracılığıyla yurt dışındaki sunucularda işlenebilir. Yurt dışına aktarım KVKK m.9 kapsamındaki güvenceler (standart sözleşme, açık rıza vb.) çerçevesinde yapılır. Yapay zekâya yalnızca kullanıcının o anda başlattığı istekteki içerik (metin/fotoğraf) gönderilir.'],
            ['Saklama süresi', 'Veriler sözleşme süresince ve yasal zamanaşımı/saklama süreleri boyunca saklanır; sonrasında silinir, yok edilir veya anonim hale getirilir. Lisans bitiminden sonra veriler 30 gün boyunca yalnızca okuma ve dışa aktarma için erişilebilir kalır; silme talebiniz varsa verileriniz makul sürede kalıcı olarak silinir.'],
            ['Haklarınız (m.11)', 'Verilerin işlenip işlenmediğini öğrenme, bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarılan üçüncü kişileri bilme, düzeltme, silme/yok etme, itiraz ve zarar halinde tazminat talep etme haklarına sahipsiniz. Başvurular yukarıdaki iletişim kanalından yapılır; yanıt süresi en geç 30 gündür. Kişisel Verileri Koruma Kurulu\'na şikâyet hakkınız saklıdır.'],
            ['Salonun müşterilerine karşı yükümlülüğü', 'Kullanıcı, müşterilerinden veri alırken kendi aydınlatma metnini sunmalı; sağlık ve fotoğraf verileri için ve yapay zekâ analizi öncesinde müşterisinden ayrıca açık rıza almalıdır. Müşteri rızasını geri çektiğinde ilgili veriler silinmelidir.'],
            ['Açık rıza (yapay zekâ)', 'Aşağıdaki isteğe bağlı kutuyu işaretleyerek, yapay zekâ özelliklerinde girilen metin ve fotoğrafların Google Gemini altyapısında işlenmesine ve yurt dışına aktarılmasına açık rıza verirsiniz. Rıza vermezseniz uygulamanın diğer özellikleri çalışmaya devam eder, yapay zekâ özellikleri kapalı kalır. Rızanızı istediğiniz zaman geri alabilirsiniz.']
          ]
        },
        {
          id: 'AI', baslik: '3. Yapay Zekâ ve Mesleki Sorumluluk Bildirimi',
          maddeler: [
            ['Danışma amaçlıdır', 'LUMIO Master AI; randevu çözümleme, öneri ve ön analiz sunan bir yardımcıdır. Çıktılar tıbbi, dermatolojik veya mesleki tavsiye değildir ve hatalı olabilir. Nihai karar ve uygulama her zaman belgeli uzman olan Kullanıcıya aittir.'],
            ['Kimyasal işlemler ve alerji', 'Boya, açıcı, düzleştirici gibi kimyasal işlemlerden önce alerji/yama testi ve ürün üreticisinin talimatları esas alınmalıdır. Yapay zekâ önerileri bunların yerini tutmaz; kimyasal işlem ve alerji sonuçlarından doğan sorumluluk uygulamayı yapan Kullanıcıya aittir.'],
            ['Doğrulama', 'Tarih, saat, tutar ve müşteri adı gibi yapay zekâ tarafından çözümlenen bilgiler kaydetmeden önce kontrol edilmelidir.'],
            ['Fotoğraf', 'Fotoğraf analizinde yalnızca müşterinin açık rızasıyla ve mümkünse yüzü içermeyen görseller kullanılmalıdır.'],
            ['Üçüncü taraf hizmetler', 'Yapay zekâ özellikleri Google Gemini gibi üçüncü taraf hizmetlerine dayanır; bu hizmetlerin kendi şartları ve kullanılabilirliği geçerlidir. Ürün bağlantıları ve öneriler reklam veya garanti niteliği taşımaz.']
          ]
        }
      ]
    };
  }

  /* ----------------------- İNGİLİZCE ORTAK ŞABLON ----------------------- */
  var EN = {
    EU: {
      law: 'the EU General Data Protection Regulation (Regulation (EU) 2016/679, "GDPR") and applicable national law',
      basis: 'Art. 6(1)(b) GDPR (contract), 6(1)(c) (legal obligation), 6(1)(f) (legitimate interests) and, for health-related data, photos and AI analysis, Art. 9(2)(a) and Art. 6(1)(a) (explicit consent)',
      rights: 'access, rectification, erasure, restriction, portability and objection (Arts. 15–21 GDPR), and to withdraw consent at any time. You may lodge a complaint with your local supervisory authority',
      transfer: 'Data may be processed outside the EEA (e.g., in the United States by Google, GitHub and Cloudflare). Transfers rely on an adequacy decision (such as the EU–US Data Privacy Framework where the recipient is certified), Standard Contractual Clauses, or your explicit consent',
      law2: 'the laws of the EU Member State in which the Provider is established. Mandatory consumer-protection rules of your country of residence remain unaffected',
      marketing: 'Electronic marketing messages (e.g., WhatsApp, SMS, e-mail) require recipient consent under the ePrivacy rules and national law (opt-in) and must offer an easy opt-out.',
      extra: 'The User, as controller, must be able to document a lawful basis for each processing purpose and, where required, maintain a record of processing activities (Art. 30) and carry out a data protection impact assessment.'
    },
    UK: {
      law: 'the UK General Data Protection Regulation and the Data Protection Act 2018 ("UK GDPR")',
      basis: 'Art. 6(1)(b), 6(1)(c), 6(1)(f) UK GDPR and, for health-related data, photos and AI analysis, Art. 9(2)(a) and 6(1)(a) (explicit consent)',
      rights: 'access, rectification, erasure, restriction, portability and objection, and to withdraw consent at any time. You may complain to the Information Commissioner\'s Office (ICO)',
      transfer: 'Data may be processed outside the UK (e.g., in the United States by Google, GitHub and Cloudflare). Transfers rely on UK adequacy regulations (including the UK–US data bridge where applicable), the UK International Data Transfer Agreement/Addendum, or your explicit consent',
      law2: 'the laws of England and Wales (or Scotland/Northern Ireland if you are resident there). Mandatory consumer rights remain unaffected',
      marketing: 'Electronic marketing messages require prior consent under the Privacy and Electronic Communications Regulations (PECR) and must include an opt-out.',
      extra: 'The User, as controller, must be able to document a lawful basis for each purpose and, where required, pay the ICO data protection fee.'
    },
    US: {
      law: 'applicable U.S. federal and state privacy laws, including the California Consumer Privacy Act as amended (CCPA/CPRA) and comparable state laws where they apply',
      basis: 'the performance of the agreement, our legitimate business purposes, legal obligations and, where required (e.g., health-related information, photos, AI analysis), your consent',
      rights: 'depending on your state: to know/access, correct, delete, port, and opt out of "sale"/"sharing" and targeted advertising. We do not sell personal information. We will not discriminate against you for exercising these rights',
      transfer: 'Data is stored and processed in the United States and possibly other countries by our infrastructure providers (Google, GitHub, Cloudflare)',
      law2: 'the laws of the State in which the Provider is established, excluding conflict-of-law rules. Nothing limits non-waivable consumer rights',
      marketing: 'Text/WhatsApp/e-mail marketing must comply with the TCPA, CAN-SPAM and state rules: obtain prior express written consent where required, honor opt-outs (e.g., "STOP") promptly.',
      extra: 'Do not upload images that capture face geometry for identification. Some states (e.g., Illinois BIPA, Texas, Washington) regulate biometric identifiers; this service does not intend to process them. LUMIO is not designed to process regulated health records, and the Provider is not a HIPAA business associate.'
    },
    GLOBAL: {
      law: 'the data protection laws that apply to you and to the Provider (e.g., local privacy statutes, the GDPR where it applies extraterritorially)',
      basis: 'the performance of the agreement, legitimate interests, legal obligations and, for health-related data, photos and AI analysis, your explicit consent',
      rights: 'access, correction, deletion, objection, portability and withdrawal of consent, to the extent provided by your local law. You may also complain to your local data protection authority',
      transfer: 'Data may be stored and processed in other countries (e.g., the United States) by our infrastructure providers (Google, GitHub, Cloudflare) under appropriate safeguards or with your consent',
      law2: 'the laws of the country in which the Provider is established, without regard to conflict-of-law rules; mandatory local consumer and data protection laws remain unaffected',
      marketing: 'Marketing messages (WhatsApp, SMS, e-mail) require consent wherever local law demands it. Always provide an easy opt-out.',
      extra: 'The User is responsible for complying with all local laws applicable to the salon\'s business, including licensing, hygiene/health regulations and consumer law.'
    }
  };

  function metinEN(bolge) {
    var F = LEGAL.firma.unvan;
    var r = EN[bolge] || EN.GLOBAL;
    var dpaTitle = (bolge === 'US') ? 'Service-provider terms' : 'Data processing terms (Art. 28 GDPR summary)';
    return {
      dil: 'en',
      belgeler: [
        {
          id: 'EULA', baslik: '1. Terms of Service and License Agreement',
          maddeler: [
            ['Parties and subject', F + ' ("Provider") offers LUMIO, a cloud-based appointment, customer and cash-desk management application for beauty and hair salons. By signing in, the salon owner or professional ("User") accepts this agreement.'],
            ['License', 'The Provider grants the User a non-exclusive, non-transferable right to use LUMIO during the license term. Sharing the account with third parties, copying, reverse engineering, attempting unauthorized access or disrupting the service is prohibited.'],
            ['Account security', 'Sign-in credentials (phone number and password) are personal. The User is responsible for keeping them confidential and for all activity under the account, and must promptly report suspected unauthorized access.'],
            ['Fees, term and renewal', 'License fees and term are communicated separately. Access may be suspended at the end of the term or for non-payment. The User may export their data while the license is active and for 30 days after it ends (read-only access and export).'],
            ['Roles under data protection law', 'For data about the User\'s own customers, the User is the controller and the Provider is the processor (service provider). The User is responsible for giving privacy notices to customers, obtaining consent where required (especially for health-related information, allergies, scalp/hair analysis and photos), and for lawful use of marketing messages. ' + r.marketing],
            ['User obligations', 'The User will use LUMIO lawfully, ensure that the data entered was lawfully obtained, and not process children\'s data without the required parental consent. ' + r.extra],
            ['Service and backups', 'The service is provided with reasonable care on an "as is" and "as available" basis, without a promise of uninterrupted or error-free operation. Temporary interruptions (maintenance, infrastructure providers, force majeure) may occur. The User is responsible for keeping backups of critical data.'],
            ['Limitation of liability', 'To the maximum extent permitted by law, and without limiting liability that cannot be excluded (such as for intent, gross negligence, fraud or death/personal injury), the Provider is not liable for indirect or consequential loss, lost profits or data loss, and its total liability is limited to the license fees paid by the User in the preceding 12 months.'],
            ['Intellectual property', 'All rights in the software, design, brand and content belong to the Provider. Data entered by the User remains the User\'s.'],
            ['Termination', 'Either party may terminate by notice. The Provider may suspend or close the account on breach. After termination, data is deleted or anonymized within a reasonable period, subject to legal retention duties.'],
            ['Changes', 'The Provider may update these terms. For material changes a new version is published and the User\'s renewed acceptance is requested.'],
            ['Evidence of acceptance', 'The User agrees that electronic records of this acceptance (time, version, text fingerprint and device information) may be used as evidence.'],
            ['Governing law', 'This agreement is governed by ' + r.law2 + '.']
          ]
        },
        {
          id: 'PRIVACY', baslik: '2. Privacy Notice and Consent',
          maddeler: [
            ['Who is responsible', 'The salon (User) is the controller for its customers\' data. ' + F + ' is the controller for the User\'s account data and the processor for the User\'s customer data. ' + iletisimSatiri('en')],
            ['Data we process', 'User: name, phone number, license and sign-in records, device/browser information, acceptance record. Salon customers: name, phone number, date of birth, appointment and visit history, services and prices, color formulas and notes. If entered by the User: allergies, scalp/hair condition and photos (potentially special-category or sensitive data).'],
            ['Purposes', 'Appointment and customer management, cash-desk tracking, reminders and notifications, license and account administration, security and troubleshooting, legal compliance and, on request, AI-assisted consultation features.'],
            ['Legal basis', 'We process data under ' + r.basis + '. Applicable law: ' + r.law + '.'],
            ['Service providers and transfers', 'We use Google (Firebase/Cloud Firestore; Google Gemini when AI features are used) and GitHub (hosting) and Cloudflare (relay of AI requests). ' + r.transfer + '. Only the content of an AI request that the user starts (text/photo) is sent to the AI service.'],
            ['Retention', 'Data is kept while the agreement is active and for the legal limitation or retention periods that apply; afterwards it is deleted or anonymized. After the license ends, data stays available for read-only access and export for 30 days; on request, your data is permanently deleted within a reasonable period. Authorized Provider personnel may access account data where necessary for support, security and legal compliance, under confidentiality obligations.'],
            ['Your rights', 'You have the right to ' + r.rights + '. Send requests through the contact channel above; we aim to respond within one month (or the period required by law).'],
            ['Duties of the salon toward its customers', 'The User must give customers its own privacy notice, obtain separate consent for health-related data and photos and before AI analysis, and delete data when consent is withdrawn.'],
            ['AI consent (optional)', 'By ticking the optional box below you consent to the processing of the text and photos you enter in AI features by Google Gemini, including transfer outside your country. If you do not consent, all other features keep working and AI features stay disabled. You can withdraw consent at any time.'],
            [dpaTitle, 'The Provider processes customer data only on the User\'s documented instructions (using LUMIO); ensures that persons authorized to process the data are bound by confidentiality; applies appropriate technical and organizational security measures; engages sub-processors (Google, GitHub, Cloudflare) under written terms; assists the User with data-subject requests, breach notification and impact assessments; and deletes or returns the data at the end of the service. The User may request the list of sub-processors at any time.']
          ]
        },
        {
          id: 'AI', baslik: '3. AI and Professional Responsibility Notice',
          maddeler: [
            ['Advisory only', 'LUMIO Master AI is an assistant that interprets bookings and offers suggestions and preliminary analysis. Outputs are not medical, dermatological or professional advice and may be wrong. The final decision and the service always remain with the licensed professional (the User).'],
            ['Chemical treatments and allergies', 'Before any chemical service (coloring, bleaching, straightening, etc.) follow the manufacturer\'s instructions and perform a patch/allergy test. AI suggestions never replace these steps. Responsibility for chemical services and allergic reactions lies with the professional performing them.'],
            ['Verify before saving', 'Check dates, times, amounts and customer names interpreted by the AI before confirming.'],
            ['Photos', 'Analyze photos only with the customer\'s explicit consent and, where possible, without showing the face.'],
            ['Third-party services', 'AI features depend on third-party services such as Google Gemini, whose own terms and availability apply. Product links and recommendations are not advertising endorsements or warranties.']
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
    var taslak = LEGAL.hukukcuOnayli ? '' :
      '<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.35);color:#fbbf24;border-radius:12px;padding:8px 10px;font-size:10px;line-height:1.4;margin-bottom:8px">' +
      (m.dil === 'tr' ? 'Bu metinler taslaktır; yayımlanmadan önce hukuk danışmanınca onaylanmalıdır.' : 'These texts are a draft and must be reviewed by legal counsel before publication.') + '</div>';
    var html = taslak;
    m.belgeler.forEach(function (b, bi) {
      html += '<details ' + (bi === 0 ? 'open ' : '') + 'style="background:#020617;border:1px solid #1e293b;border-radius:14px;margin-bottom:8px;overflow:hidden">' +
        '<summary style="cursor:pointer;padding:11px 12px;font-weight:800;color:#fbbf24;font-size:12px;list-style:none">' + esc(b.baslik) + '</summary>' +
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
    } catch (e) { /* düşer */ }
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
