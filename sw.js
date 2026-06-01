const CACHE_NAME = "bruxaria-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
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
  const url = new URL(event.request.url);
  
  // Para arquivos HTML (regras, galeria, etc), usa "network first"
  if (event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          }
          return caches.match(event.request) || response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Para CSS, imagens e outros recursos, usa "cache first"
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});