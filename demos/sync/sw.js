self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('sync', function(event) {
  self.registration.showNotification("Sync event fired!");
});
