console.log("SW startup");

this.onmessage = function(event) {
  console.log("Got message in SW", event.data.text);
  if (event.source) {
    event.source.postMessage("Woop!");
  }
  else {
    console.log("No event.source");
  }

  event.data.port.postMessage("Woop!");
};