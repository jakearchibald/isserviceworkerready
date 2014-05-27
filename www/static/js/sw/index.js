console.log("This log is from the serviceworker!");
console.log(this.addEventListener);
addEventListener('message', function(event) {
  //console.log("onmessage");
  //console.log(event);
  //event.source.postMessage("Reply from SW");
});