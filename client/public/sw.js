const CACHE_NAME = "mi-app-cache-v2";  // Incrementa la versión al hacer cambios
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/main.chunk.js",
  "/static/css/main.chunk.css",
  "/logo192.png",
  "/badge.png"
];

// --- Instalación y Caching ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// --- Limpieza de Caches Antiguos ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// --- Estrategia de Cache Híbrida ---
self.addEventListener("fetch", (event) => {
  // Ignora todas las peticiones que no sean GET
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// --- Notificaciones Push ---
self.addEventListener('push', (event) => {
  const fallbackPayload = {
    title: 'Nueva notificación',
    body: '¡Tienes una actualización!',
    url: '/'
  };

  const payload = event.data?.json().catch(() => fallbackPayload) || fallbackPayload;

  const options = {
    body: payload.body,
    icon: '/logo192.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    data: { url: payload.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
      .then(() => {
        if ('setAppBadge' in navigator) {
          navigator.setAppBadge(1).catch(e => console.log("Badge no soportado"));
        }
      })
      .catch(err => console.error('Error en notificación:', err))
  );
});

// --- Clic en Notificación ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      const client = windowClients.find(c => c.url === url);
      return client ? client.focus() : clients.openWindow(url);
    })
  );
});