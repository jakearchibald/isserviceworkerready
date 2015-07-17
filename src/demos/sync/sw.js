self.addEventListener('sync', function(event) {
  event.waitUntil(
    self.registration.showNotification("Sync event fired!")
  );
});