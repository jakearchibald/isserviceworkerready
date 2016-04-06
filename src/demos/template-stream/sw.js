self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

function htmlEscapeStream(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    pull(controller) {
      return reader.read().then(result => {
        if (result.done) {
          controller.close();
          return;
        }
        
        const val = decoder.decode(result.value, {stream:true}).replace(/[&<>"'`]/g, item => htmlEscapes[item]);
        controller.enqueue(encoder.encode(val));
      })
    }
  });
}

function templateStream(strings, ...values) {
  let items = [];
  
  strings.forEach((str, i) => {
    items.push(str);
    if (i in values) items.push(values[i]);
  });
  
  items = items.map(i => Promise.resolve(i)).values();
  
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    pull(controller) {
      const result = items.next();
      
      if (result.done) {
        controller.close();
        return;
      }
      
      return result.value.then(val => {
        if (val.getReader) {
          const reader = val.getReader();
          return reader.read().then(function process(result) {
            if (result.done) return;
            controller.enqueue(result.value);
            return reader.read().then(process);
          });
        }
        controller.enqueue(encoder.encode(val));
      })
    }
  });
}

self.addEventListener('fetch', event => {
  const delayedContent = new Promise(r => setTimeout(r, 2000)).then(() => "This content arrives after 2 seconds");
  const swTest = fetch('sw.js').then(r => htmlEscapeStream(r.body));
  
  const body = templateStream`<!DOCTYPE html>
    <html>
    <head><title>Holy streaming Batman!</title></head>
    <body>
      <h1>This content streams in from SW</h1>
      <p>${delayedContent}</p>
      <h1>And here's the service worker that generated this:</h1>
      <pre>${swTest}</pre>
    </body>
    </html>
  `;
  
  event.respondWith(
    new Response(body, {
      headers: {'Content-Type': 'text/html'}
    })
  );
});
