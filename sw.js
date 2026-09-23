const CACHE = "gold-analyzer-v2";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./icon-192.png",
        "./icon-512.png"
      ])
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  /*
    Las llamadas a nuestras APIs NO se guardan
    en la caché. Así obtenemos datos actuales.
  */

  if (
    url.pathname.startsWith("/api/")
  ) {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  /*
    Para la página principal intentamos obtener
    primero la versión nueva de Internet.
  */

  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith("/index.html") ||
    url.pathname === "/"
  ) {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const copia = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copia);
          });

          return response;

        })
        .catch(() =>
          caches.match(event.request)
        )
    );

    return;
  }

  /*
    Para archivos normales:
    caché primero y red como respaldo.
  */

  event.respondWith(
    caches.match(event.request)
      .then(response =>
        response || fetch(event.request)
      )
  );

});
