const cacheName = 'kar-app-v2'; // ← increment this when you update files

const filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// 🔹 Install event — cache your app files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

// 🔹 Activate event — delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      )
    )
  );
});

// 🔹 Fetch event — serve cached files or fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

