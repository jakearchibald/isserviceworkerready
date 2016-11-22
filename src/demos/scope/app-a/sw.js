self.addEventListener('fetch', event => {
  console.log('Intercepted fetch for', event.request.url);
  console.log('Intercepted by', location.href, 'with scope', registration.scope);
});