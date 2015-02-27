self.oninstall = function() {
  self.skipWaiting();
};

self.onactivate = function() {
  clients.claim();
};

self.onmessage = function(event) {
  if (event.data == 'claim') {
    clients.claim();
  }
};


self.onfetch = function(event) {
  var url = new URL(event.request.url);
  if (url.host === 'nooooope') {
    event.respondWith(
      new Response('{"This came from": "The ServiceWorker"}', {
        headers: {
          "Content-Type": "application/json"
        }
      })
    );
  }
};