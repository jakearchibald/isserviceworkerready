function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

self.addEventListener('install', function(event) {
  console.log("Installing…");
  event.waitUntil(
    wait(5000).then(function() {
      console.log("Installed!");
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("Activating…");
  event.waitUntil(
    wait(5000).then(function() {
      console.log("Activated!");
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(new Response("Hello everyone!"));
});
