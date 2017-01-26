// Slow the serviceworker down a bit
const start = Date.now();
while (Date.now() - start < 500);

addEventListener('install', event => {
  event.waitUntil(async function() {
    const cache = await caches.open('nav-preload-demo-v1');
    await cache.addAll([
      'script.js',
      'styles.css'
    ]);
  }());
});

addEventListener('activate', event => {
  event.waitUntil(async function() {
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }
  }());
});

addEventListener('fetch', event => {
  event.respondWith(async function() {
    const response = await event.preloadResponse;
    if (response) {
      console.log('Using preloaded response!');
      return response;
    }

    const cachedResponse = await caches.match(event.request);
    return cachedResponse || fetch(event.request);
  }());
});