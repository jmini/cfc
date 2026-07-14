/* =========================================================================
   Service worker — Cdf Clécy
   -------------------------------------------------------------------------
   Stratégie "réseau d'abord" : quand il y a du réseau, on sert toujours la
   dernière version (et on met le cache à jour au passage) ; hors-ligne, on
   retombe sur la dernière version mise en cache.

   >>> À CHAQUE DÉPLOIEMENT contenant des changements, incrémentez VERSION
   (v1 -> v2 -> ...) pour purger proprement l'ancien cache. <<<
   ========================================================================= */
const VERSION = "v4";
const CACHE = "cfc-" + VERSION;

// Ressources de base à mettre en cache pour le fonctionnement hors-ligne
const CORE = [
  "./",
  "./index.html",
  "./config.json",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // On ne gère que les GET de notre propre origine
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Réseau OK -> on rafraîchit le cache et on renvoie la réponse fraîche
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        // Hors-ligne -> on sert la version en cache (ou index.html en secours)
        caches.match(req).then((cached) => cached || caches.match("./index.html"))
      )
  );
});
