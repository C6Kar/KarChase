const cacheName = 'kar-app-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/Assets/karchase1.png',
  '/Assets/karchase2.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
