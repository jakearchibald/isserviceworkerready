console.log("SW started");

self.addEventListener('install', function(event) {
  console.log("Installing");
  event.waitUntil(
    Promise.reject(Error('Blahhhhh nope'))
  );
});

self.addEventListener('activate', function() {
  console.log("Activating");
});

self.addEventListener('fetch', function(event) {
  console.log("Fetch " + event.request.url);
});
