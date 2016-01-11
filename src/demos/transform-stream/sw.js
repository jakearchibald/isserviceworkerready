self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin != location.origin) return;
  
  if (requestURL.pathname.endsWith("/demos/transform-stream/")) {
    event.respondWith(
      fetch('cloud.html').then(response => {
        return replaceResponse(response, 5, /cloud/ig, match => {
          if (match.toUpperCase() == match) return 'BUTT';
          if (match[0] == 'C') return 'Butt';
          return 'butt';
        });
      })
    );
  }
});

function replaceResponse(response, bufferSize, match, replacer) {
  const reader = response.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let bufferStr = '';

  const stream = new ReadableStream({
    pull: controller => {
      return reader.read().then(function(result) {
        if (result.done) {
          controller.close();
          return;
        }

        const bytes = result.value;
        bufferStr += decoder.decode(bytes, {stream: true});
        const strToSend = bufferStr.slice(0, -bufferSize).replace(match, replacer);
        controller.enqueue(encoder.encode(strToSend));
        bufferStr = bufferStr.slice(-bufferSize);
      });
    }
  });

  return new Response(stream, {
    headers: response.headers
  });
}