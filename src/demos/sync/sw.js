self.addEventListener('sync', function(event) {
  event.waitUntil(
    Promise.all([
      self.registration.showNotification("Sync event fired!"),
      fetch('./').catch(function() {
        return self.registration.showNotification("…but the network wasn't ready :(");
      })
    ])
  );
});