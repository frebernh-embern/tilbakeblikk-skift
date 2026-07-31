// Enkel service worker for offline-støtte og PWA-installasjon
const CACHE = "tilbakeblikk-v1";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./header.jpg", "./icon-192.png", "./icon-512.png",
  "./firebase-config.js"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = e.request.url;
  // Firestore/Firebase alltid live (ikke cache)
  if (url.includes("firestore") || url.includes("googleapis") || url.includes("gstatic")) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(()=>caches.match("./index.html")))
  );
});
