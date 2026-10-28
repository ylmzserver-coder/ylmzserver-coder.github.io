/* LUMIO AI Terminal - Service Worker & Banka Tipi Web Push Motoru */
const CACHE_NAME = 'lumio-ai-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

/* BANKA BİLDİRİMİ GİBİ KİLİT EKRANINA FIRLATMA MOTORU */
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
    vibrate: [300, 100, 300, 100, 300], // Belirgin banka titreşimi
    tag: 'lumio-alarm-' + Date.now(),
    renotify: true,
    requireInteraction: true // Usta kapatana kadar ekranda asılı kalsın
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/* BİLDİRİME TIKLAYINCA DİREKT UYGULAMAYI AÇ */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});