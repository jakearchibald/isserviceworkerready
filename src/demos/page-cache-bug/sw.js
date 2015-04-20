self.oninstall = function() {
  self.skipWaiting();
};

self.onactivate = function() {
  clients.claim();
};


self.onfetch = function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
};