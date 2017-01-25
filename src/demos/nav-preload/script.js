navigator.serviceWorker.register('sw.js');

// Log performance details:
window.addEventListener('load', () => {
  for (const key of ['fetchStart', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domComplete']) {
    console.log(key, performance.timing[key] - performance.timing.navigationStart);
  }
});
