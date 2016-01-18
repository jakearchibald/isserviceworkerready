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
        return replaceResponse(response, 4, /cloud/ig, match => {
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
      return reader.read().then(result => {
        if (result.done) {
          controller.enqueue(encoder.encode(bufferStr));
          controller.close();
          return;
        }

        const bytes = result.value;
        let lastReplaceEnds = 0;
        bufferStr += decoder.decode(bytes, {stream: true});
        bufferStr = bufferStr.replace(match, (...args) => {
          lastReplaceEnds = args[0].length + args[args.length - 2];
          return replacer(...args);
        });

        controller.enqueue(encoder.encode(bufferStr.slice(0, -bufferSize)));

        bufferStr = bufferStr.slice(
          Math.max(bufferStr.length - bufferSize, lastReplaceEnds)
        );
      });
    },
    cancel: () => {
      reader.cancel();
    }
  });

  return new Response(stream, {
    headers: response.headers
  });
}