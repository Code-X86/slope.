/* Cross-origin isolation helper for local/GitHub Pages static hosting.
   Loaded as a page script, it registers itself as a service worker. Loaded
   as a service worker, it adds the headers required by SharedArrayBuffer. */
(function () {
  var isServiceWorker = typeof ServiceWorkerGlobalScope !== 'undefined' && self instanceof ServiceWorkerGlobalScope;

  if (!isServiceWorker) {
    if (window.crossOriginIsolated || !('serviceWorker' in navigator)) return;
    if (window.isSecureContext === false && location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') return;

    var reloadKey = 'mini-play-coi-reload';
    var scriptUrl = document.currentScript ? document.currentScript.src : new URL('coi-serviceworker.js', location.href).href;
    var scopeUrl = new URL('./', scriptUrl).href;
    navigator.serviceWorker.register(scriptUrl, { scope: scopeUrl }).then(function () {
      if (navigator.serviceWorker.controller) return;
      if (sessionStorage.getItem(reloadKey)) return;
      sessionStorage.setItem(reloadKey, '1');
      navigator.serviceWorker.ready.then(function () {
        location.reload();
      });
    }).catch(function (error) {
      console.warn('[coi] service worker registration failed:', error);
    });
    return;
  }

  self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', function (event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

    event.respondWith(fetch(event.request).then(function (response) {
      if (
        response.status === 0 ||
        response.type === 'opaque' ||
        response.type === 'opaqueredirect'
      ) {
        return response;
      }

      var requestUrl = new URL(event.request.url);
      var scopeUrl = new URL(self.registration.scope);
      if (requestUrl.origin !== scopeUrl.origin) return response;

      var headers = new Headers(response.headers);
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
      headers.set('Cross-Origin-Resource-Policy', 'same-origin');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
    }).catch(function (error) {
      console.warn('[coi] fetch passthrough failed:', error);
      throw error;
    }));
  });
})();
