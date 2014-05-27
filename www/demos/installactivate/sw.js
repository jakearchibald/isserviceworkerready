console.log("SW startup");

this.install = function(event) {
  console.log("Install event", event);
  console.log(".replace", event.replace);
  console.log(".waitUntil", event.waitUntil);
};

this.activate = function(event) {
  console.log("Activate event", event);
  console.log(".waitUntil", event.waitUntil);
};