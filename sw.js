/* LUMIO AI Terminal - Service Worker & Banka Tipi Bildirim Motoru (V8) */
const CACHE_NAME = 'lumio-ai-cache-v8';
const OFFLINE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 1. KURULUM (Statik çekirdek dosyaları önbelleğe al)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn('Statik önbellekleme atlandı:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. AKTİF ETME (Eski v7 ve önceki önbellekleri temizle ve kontrolü devral)
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

// 3. ÇEVRİMDIŞI ÇALIŞMA (Network First, Cache Fallback + Güvenli Put)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Dış API veya Google isteklerini doğrudan internete bırak
  if (!url.origin.includes(self.location.origin) && !url.hostname.includes('cdnjs') && !url.hostname.includes('gstatic')) {
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

// 4. BANKA TİPİ KİLİT EKRANI PUSH BİLDİRİMİ
self.addEventListener('push', (event) => {
  let data = {
    title: '⏰ LUMIO: Randevu Vakti Yaklaştı!',
    body: 'Birazdan başlayacak randevunuz bulunuyor.',
    icon: 'logo.png',
    badge: 'logo.png'
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'logo.png',
    badge: data.badge || 'logo.png',
    vibrate: [400, 200, 400, 200, 400],
    tag: 'lumio-randevu-alarm',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'tamam', title: 'Aç 👍' },
      { action: 'ertele', title: '10 Dk Ertele ⏱️' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. BİLDİRİM TIKLANDIĞINDA
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'ertele') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'ERTELE_ALARM', dakika: 10 });
          return clientList[0].focus();
        }
      })
    );
  } else {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          const clientUrl = new URL(client.url);
          if ((clientUrl.pathname.endsWith('index.html') || clientUrl.pathname.endsWith('/')) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('./index.html');
        }
      })
    );
  }
});