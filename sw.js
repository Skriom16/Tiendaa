const CACHE_NAME = "Recursos";

self.addEventListener("install", (event) => {
    caches.delete(CACHE_NAME);
    const recursos = caches.open(CACHE_NAME).then((cache) => {
        cache.add("/");
        cache.add("default.jpeg");
        cache.add("app.js");
        cache.add("index.html");
        cache.add("manifest.json");
        cache.add("style.css");
        cache.add("icons/icon-72x72.png");
        cache.add("icons/icon-96x96.png");
        cache.add("icons/icon-128x128.png");
        cache.add("icons/icon-144x144.png");
        cache.add("icons/icon-152x152.png");
        cache.add("icons/icon-192x192.png");
        cache.add("icons/icon-384x384.png");
        cache.add("icons/icon-512x512.png");
    });
    event.waitUntil(recursos);
  });

  self.addEventListener("fetch", (event) => {
    const respuesta = fetch(event.request).then((newResp) => {
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, newResp);
      });

      return newResp.clone();      
    }).catch(err =>{
      return caches.match(event.request);
    })
    event.respondWith(respuesta);
});