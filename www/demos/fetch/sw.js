console.log("fetch", this.fetch);

if (this.fetch) {
  console.log("Attempting fetch");
  fetch('./').then(function(res) {
    console.log("Response", res);
    return res.text();
  }).then(function(text) {
    console.log("body", text);
  }).catch(function(err) {
    console.error(err);
  }).then(function() {
    console.log("Attempting JSON fetch");
    return fetch('./json.json');
  }).then(function(res) {
    console.log("Response", res);
    return res.json();
  }).then(function(data) {
    console.log("body", data);
  }).catch(function(err) {
    console.error(err);
  }).then(function() {
    console.log("Attempting fetch outside of scope");
    return fetch('/');
  }).then(function(res) {
    console.log("Response", res);
    return res.text();
  }).then(function(text) {
    console.log("body", text);
  }).catch(function(err) {
    console.error(err);
  });
}
