var CACHE_NAME = "teleprompter-v3";
var ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE_NAME).then(function(cache){
    return cache.addAll(ASSETS);
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(resp){
      return resp || fetch(e.request);
    })
  );
});
