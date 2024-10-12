self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/45daychallenge/",
        "/45daychallenge/index.html",
        "/45daychallenge/style.css",
        "/45daychallenge/app.js",
        "/45daychallenge/icon.png",
        "/45daychallenge/manifest.json",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
