self.addEventListener('activate', _ => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  console.log(event.request);
  event.respondWith(fetch(event.request));
});