const CACHE_NAME = "bruxaria-cache-v1";
const urlsToCache = [
  "/", 
  "/ranking.html", 
  "/galeria.html", 
  "/style-ranking.css", 
  "/style.css", 
  "/logopng.png", 
  "/galeriafundo.jpeg"
];

self.addEventListener("install", event => {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  console.log("Service Worker ativado");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );

  self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      // Se não achar no cache, tenta buscar
      return resp || fetch(event.request).catch(() => caches.match("/ranking.html"));
    })
  );
});
});