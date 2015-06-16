console.log("SW started");

self.addEventListener('install', function(event) {
  console.log("Installing");
});

self.addEventListener('activate', function() {
  console.log("Activating");
});

self.addEventListener('fetch', function(event) {
  console.log("Fetch " + event.request.url);
});

self.addEventListener('message', function() {
  console.log("postMessage received");
});

// update......