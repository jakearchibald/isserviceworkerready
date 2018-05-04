importScripts('jsmpeg.js', 'gif.js');

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin != location.origin) return;
  
  if (requestURL.pathname.endsWith("/demos/gif-stream/")) {
    event.respondWith(fetch('gif.html'));
    return;
  }

  if (requestURL.pathname.endsWith(".gif")) {
    event.respondWith(streamGIF(requestURL.pathname.replace(/\.gif$/, '.mpg')));
    return;
  }
});

function streamGIF(url) {
  return fetch(url).then(response => {
    const jsmpeg = new JSMPEG();
    const reader = response.body.getReader();

    function readToJSMPEG() {
      return reader.read().then(result => {
        if (result.done) {
          jsmpeg.writeEnd();
          return;
        }
        jsmpeg.write(result.value);
        return readToJSMPEG();
      });
    }

    // read the response into jsmpeg
    readToJSMPEG();

    // wait for width/height info
    return jsmpeg.ready.then(function() {
      const gif = new GIFEncoder(jsmpeg.width, jsmpeg.height);
      gif.start();
      gif.setQuality(10);
      gif.setRepeat(0);
      gif.setFrameRate(jsmpeg.pictureRate);
      
      const frameReader = jsmpeg.readable.getReader();

      function readFramesToGIF() {
        frameReader.read().then(function(result) {
          if (result.done) {
            gif.finish();
            return;
          }
          gif.addFrame(result.value);
          setTimeout(readFramesToGIF, 0);
        });
      }

      readFramesToGIF();

      return new Response(gif.readable, {
        headers: {'Content-Type': 'image/gif'}
      });
    });
  });
}