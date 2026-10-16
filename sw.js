/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — sw.js (service worker de l'application installable)
   ══════════════════════════════════════════════════════════════════════
   Version PRUDENTE :
   - Il ne s'occupe QUE des fichiers du site artiroyce.com (pages, images,
     scripts). Tout le reste passe directement, sans intervention :
     Firebase (connexion, messages, Firestore, Storage), Google, Cloudflare…
   - Il ne touche JAMAIS au dossier /api/ (appels audio/vidéo : turn, sfu).
   - Internet d'abord : quand la connexion marche, on reçoit toujours la
     version la plus récente (une mise à jour GitHub apparaît normalement).
     La copie gardée sur le téléphone ne sert que si internet est coupé.
   Pour retirer ce fichier un jour : il suffit de le supprimer de GitHub.
   ══════════════════════════════════════════════════════════════════════ */
const CACHE = 'artiroyce-v1';
const DE_BASE = ['/accueil.html', '/manifest.json', '/icone-192.png', '/icone-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(DE_BASE); })
      .catch(function () {}) // pas grave si une copie échoue : le site marche quand même
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (noms) {
        return Promise.all(noms.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;                     // envois, mises à jour : jamais touchés
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;     // Firebase, Google, Cloudflare… : jamais touchés
  if (url.pathname.indexOf('/api/') === 0) return;     // appels audio/vidéo : jamais touchés
  if (req.headers.get('range')) return;                // lecture vidéo par morceaux : laissée au navigateur

  e.respondWith(
    fetch(req)
      .then(function (rep) {
        if (rep && rep.ok && rep.type === 'basic') {
          const copie = rep.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copie); }).catch(function () {});
        }
        return rep;
      })
      .catch(function () {
        // Pas d'internet : on montre la dernière copie gardée, sinon l'accueil.
        return caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (r) {
          if (r) return r;
          if (req.mode === 'navigate') return caches.match('/accueil.html');
          return Response.error();
        });
      })
  );
});
