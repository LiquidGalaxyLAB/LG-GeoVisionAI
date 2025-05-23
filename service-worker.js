const CACHE_NAME = "lg-web-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./assets/LG web app.svg",
  "./assets/Liquid galaxy.svg",
  "https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  "https://esm.run/@material/web/",
  "./js/utils/indexmap.mjs",
  "./js/utils/intersection-observer.mjs",
  "./js/utils/qr-scanner-worker.min.js",
  "./js/utils/qrscanner.js",
  "./js/utils/scrollTo.mjs",
  "./js/utils/speech.mjs",
  "./js/utils/tabs.mjs",
  "./js/components/home.mjs",
  "./js/components/maps.mjs",
  "./js/components/settings.mjs",
  "./js/components/tools.mjs",
  "./js/components/voice.mjs",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
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

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
