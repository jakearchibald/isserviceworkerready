// Slow the serviceworker down a bit
const start = Date.now();
while (Date.now() - start < 500);

addEventListener('install', event => {
  event.waitUntil(async function() {
    const cache = await caches.open('nav-preload-demo-v1');
    await cache.add('../styles.css');
  }());
});

addEventListener('fetch', event => {
  event.respondWith(async function() {
    // Respond from the cache if we can
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;
    // Else try the network
    return fetch(event.request);
  }());
});