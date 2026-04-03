const CACHE_VERSION = "caddyshack-shell-v2";

function getBasePath() {
  const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
  return scopePath === "/" ? "" : scopePath;
}

function toScopeUrl(pathname) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getBasePath()}${normalizedPath}`;
}

function getShellUrls() {
  return [
    toScopeUrl("/"),
    toScopeUrl("/login/"),
    toScopeUrl("/matchday/"),
    toScopeUrl("/timeline/"),
    toScopeUrl("/ledger/"),
    toScopeUrl("/manifest.webmanifest"),
    toScopeUrl("/icon.svg"),
    toScopeUrl("/icon-maskable.svg"),
    toScopeUrl("/apple-touch-icon.svg"),
  ];
}

function isNextAssetRequest(requestUrl) {
  return requestUrl.pathname.startsWith(`${getBasePath()}/_next/`);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(getShellUrls())),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_VERSION)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (isNextAssetRequest(requestUrl)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          void caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);

          if (cachedResponse) {
            return cachedResponse;
          }

          return (
            (await caches.match(toScopeUrl("/"))) ||
            Response.error()
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseClone = response.clone();
        void caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
        return response;
      });
    }),
  );
});
