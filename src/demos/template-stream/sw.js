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

function htmlEscape(str) {
  return str.replace(/[&<>"'`]/g, item => htmlEscapes[item]);
}

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
        
        const val = htmlEscape(decoder.decode(result.value, {stream:true}));
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

function streamingTemplateResponse() {
  const kittenPhoto = fetch('https://api.flickr.com/services/rest/?api_key=f2cca7d09b75c6cdea6864aca72e9895&format=json&text=kitten&extras=url_m&per_page=1&nojsoncallback=1&method=flickr.photos.search')
    .then(r => r.json())
    .then(data => data.photos.photo[0]);

  const kittenWidth = kittenPhoto.then(data => htmlEscape(data.width_m)); 
  const kittenHeight = kittenPhoto.then(data => htmlEscape(data.height_m)); 
  const kittenURL = kittenPhoto.then(data => htmlEscape(data.url_m));
  const kittenAlt = kittenPhoto.then(data => htmlEscape(data.title));
  const swTest = fetch('sw.js').then(r => htmlEscapeStream(r.body));
  
  const body = templateStream`<!DOCTYPE html>
    <html>
    <head><title>Holy streaming Batman!</title></head>
    <body>
      <h1>This content streams in from the service worker</h1>
      <p>For instance, this image tag is populated from a Flickr request:</p>
      <img src="${kittenURL}" width="${kittenWidth}" height="${kittenHeight}" alt="${kittenAlt}">
      <p>And just to be really meta, here's the service worker that created the streaming response streamed into this response:</p>
      <pre>${swTest}</pre>
    </body>
    </html>
  `;
  
  return new Response(body, {
    headers: {'Content-Type': 'text/html'}
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.origin == location.origin && url.pathname.endsWith('/template-stream/')) {
    event.respondWith(streamingTemplateResponse());
  }
});
