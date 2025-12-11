const CACHE_NAME = "watchparty-v2"; 
const API_CACHE_NAME = "watchparty-api-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html" 
];

// 1. INSTALL: Кэшируем оболочку приложения (App Shell)
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      // Мы используем addAll, чтобы скачать эти файлы сразу
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      // Заставляем новый SW активироваться немедленно
      return self.skipWaiting();
    })
  );
});

// 2. ACTIVATE: Чистим старый кэш
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME)
          .map((cacheName) => {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  // Заставляем SW взять контроль над всеми вкладками сразу
  return self.clients.claim();
});

// 3. FETCH: Стратегия перехвата запросов
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Если интернета нет, отдаем index.html из кэша.
          // React запустится и сам покажет OfflineBanner.
          return caches.match("/index.html")
            .then((response) => {
              // Если вдруг index.html нет, пробуем корень "/"
              return response || caches.match("/");
            });
        })
    );
    return;
  }

  // Сначала сеть, потом кэш
  if (url.pathname.startsWith("/api")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Если ответ успешный, обновляем кэш
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Если сети нет, берем из кэша
          return caches.match(request);
        })
    );
    return;
  }

  // Сначала кэш, потом сеть (для скорости)
  // В режиме dev это может работать странно, но в build будет летать
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Кэшируем новые файлы на лету (например, картинки фильмов)
        if (response.ok && response.type === 'basic') { 
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});