throw Error("Faillllllll");

self.addEventListener('fetch', function(event) {
  // we never get here
  event.respondWith(new Response("If you get this response, there's a bug"));
});
