window.onmessage = function(event) {
  console.log(event);
};

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/isserviceworkerready/static/js/sw/all.js', {
    scope: '/isserviceworkerready/*'
  }).then(function(val) {
    console.log("registered!", val);
    //val.postMessage({hello: "world"});
  }).catch(function(err) {
    console.error(err);
  });
}