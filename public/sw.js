// Minimal service worker — just enough to satisfy PWA installability
// (Chrome/Android requires an active service worker with a fetch handler).
// Deliberately does no caching, so the dashboard always loads fresh data.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
