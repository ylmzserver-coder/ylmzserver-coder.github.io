/* LUMIO AI Terminal - Service Worker & Banka Tipi Web Push Motoru (V6) */
const CACHE_NAME = 'lumio-ai-cache-v6';

self.addEventListener('install', () => {
  self.skipWaiting();
});

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

/* BANKA BİLDİRİMİ GİBİ KİLİT EKRANINA FIRLATMA + ERTELEME MOTORU */
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
    vibrate: [400, 200, 400, 200, 400], // Belirgin titreşim
    tag: 'lumio-randevu-alarm',
    renotify: true,
    requireInteraction: true, // Usta dokunana kadar ekranda asılı kalsın
    actions: [
      { action: 'tamam', title: 'Tamam 👍' },
      { action: 'ertele', title: '10 Dk Ertele ⏱️' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* BİLDİRİM BUTONLARINA BASILDIĞINDA (ERTELE / TAMAM) */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'ertele') {
    // 10 dakika sonra tekrar ekrana fırlat
    setTimeout(() => {
      self.registration.showNotification('⏰ ERTELENEN RANDEVU!', {
        body: '10 dakika önce ertelediğiniz randevu vakti geldi!',
        icon: 'logo.png',
        badge: 'logo.png',
        vibrate: [400, 200, 400],
        requireInteraction: true
      });
    }, 10 * 60 * 1000);
  } else {
    // Tamam'a basıldıysa veya bildirime dokunulduysa uygulamayı öne getir
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('index.html') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow('./index.html');
      })
    );
  }
});