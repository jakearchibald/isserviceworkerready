self.addEventListener('activate', _ => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  console.log(event.request);
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response("The fetch, it failed :(");
    })
  );
});