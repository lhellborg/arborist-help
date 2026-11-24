const C = "beskarning-v16";
const FILES = ["./", "index.html", "style.css?v=16", "app.js?v=16", "plants.js?v=16", "clematis.js?v=16", "guide.js?v=16", "icon.svg", "manifest.webmanifest"];
const fresh = r => new Request(r, { cache: "reload" });
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(fresh))).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
