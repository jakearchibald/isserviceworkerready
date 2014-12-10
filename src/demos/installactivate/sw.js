console.log("SW startup");

this.oninstall = function(event) {
  console.log("Install event", event);
  console.log(".replace", event.replace);
  console.log("self.skipWaiting", self.skipWaiting);

  if (event.waitUntil) {
    console.log("Testing waitUntil:");
    event.waitUntil(new Promise(function(resolve) {
      setTimeout(function() {
        console.log("This should appear before activate");
        resolve();
      }, 3000);
    }));
  }
};

this.onactivate = function(event) {
  console.log("Activate event", event);
  console.log(".waitUntil", event.waitUntil);
};
