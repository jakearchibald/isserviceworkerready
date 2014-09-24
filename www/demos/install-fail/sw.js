self.addEventListener('install', function(event) {
  debugger;
  event.waitUntil(doSomeStuff());
});

self.addEventListener('fetch', function(event) {
  // we never get here
  event.respondWith(new Response("Hello world!"));
});

function doSomeStuff() {
  return new Promise(function(resolve) {
    setTimeout(resolve, 5000);
  }).then(function() {
    return functionDoesNotExist();
  });
}