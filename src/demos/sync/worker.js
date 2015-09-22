self.addEventListener('message', function(event) {
  navigator.serviceWorker.ready.then(function(reg) {
    return reg.sync.register({tag: 'syncTest'});
  });
});