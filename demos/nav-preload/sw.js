// Slow the serviceworker down a bit
const start = Date.now();
while (Date.now() - start < 500);

addEventListener('install', event => {
  event.waitUntil(async function() {
    const cache = await caches.open('nav-preload-demo-v1');
    await cache.add('styles.css');
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
    // Respond from the cache if we can
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    // Use the preloaded response, if it's there
    const response = await event.preloadResponse;
    if (response) return response;
    
    // Else try the network.
    return fetch(event.request);
  }());
});