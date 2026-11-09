/* LUMIO AI Terminal - Service Worker & Banka Tipi Bildirim Motoru (V15) */
const CACHE_NAME = 'lumio-ai-cache-v20';
const OFFLINE_URLS = [
  './',
  './index.html',
  './ai-client.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './logo.png',
  './legal.js'
];

// 1. KURULUM
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn('Statik önbellekleme atlandı:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. AKTİF ETME (Eski bozuk önbellekleri temizler ve yeni kodu anında devreye alır)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ÇEVRİMDIŞI ÇALIŞMA (Tailwind, FontAwesome ve Google CDN Destekli)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Kendi domainimiz veya kullandığımız CDN'ler dışındakileri önbelleğe alma
  if (
    url.origin !== self.location.origin && 
    !url.hostname.includes('cdnjs') && 
    !url.hostname.includes('gstatic') &&
    !url.hostname.includes('tailwindcss.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache))
            .catch((err) => console.warn('Önbellek yazma korundu:', err));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// 4. PUSH BİLDİRİMİ (uygulama kapalıyken de gelir)
self.addEventListener('push', (event) => {
  let d = { baslik: 'LUMIO', metin: '', tur: 'genel', tag: 'lumio' };
  if (event.data) {
    try { d = Object.assign(d, event.data.json()); } catch (e) { d.metin = event.data.text(); }
  }
  event.waitUntil(self.registration.showNotification(d.baslik || 'LUMIO', {
    body: d.metin || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || ('lumio-' + d.tur),
    renotify: true,
    requireInteraction: d.tur === 'alarm' || d.tur === 'hatirlat',
    vibrate: [300, 150, 300],
    data: { tur: d.tur }
  }));
});

// 5. BİLDİRİME DOKUNULUNCA: uygulamayı aç/odakla ve ilgili ekrana yönlendir
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tur = (event.notification.data && event.notification.data.tur) || 'genel';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) { client.postMessage({ type: 'BILDIRIM_TIKLA', tur }); return client.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html#bildirim=' + tur);
    })
  );
});
