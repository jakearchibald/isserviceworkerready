self.addEventListener('install', function(event) {
  debugger;
  event.waitUntil(doSomeStuff());
});

self.addEventListener('fetch', function(event) {
  // we never get here
  event.respondWith(new Response("If you get this response, there's a bug"));
});

function doSomeStuff() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 5000);
  }).then(function() {
    return functionDoesNotExist();
  });
}
