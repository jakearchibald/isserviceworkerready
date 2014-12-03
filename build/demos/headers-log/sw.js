self.addEventListener('fetch', function(event) {
  console.log("Fetching", event.request.url);
  console.log("Headers", new Set(event.request.headers));
  event.respondWith(fetch(event.request));
});
