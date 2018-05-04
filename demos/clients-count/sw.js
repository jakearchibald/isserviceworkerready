self.skipWaiting();

self.addEventListener('fetch', event => {
  event.respondWith(
    clients.matchAll().then(clients => new Response(`Number of controlled clients = ${clients.length}`))
  );
});