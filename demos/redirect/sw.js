self.onfetch = function(event) {
  event.respondWith(fetch(event.request));
};