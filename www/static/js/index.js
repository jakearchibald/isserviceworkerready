window.onmessage = function(event) {
  console.log(event);
};

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/isserviceworkerready/static/js/sw/index.js', {
    scope: '/isserviceworkerready/*'
  }).then(function(val) {
    console.log("registered!", val);
    val.postMessage("Hello world!");
  }).catch(function(err) {
    console.error(err);
  });
}