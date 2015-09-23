self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('sync', function(event) {
  self.registration.showNotification("Sync event fired!");
});

self.addEventListener('message', function(event) {
  self.registration.sync.register({tag: 'syncTest'});
});