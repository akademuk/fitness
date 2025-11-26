const CACHE_NAME = 'elite-fit-cache-v2';

// Assets to pre-cache immediately
const PRECACHE_URLS = [
    './',
    './index.html',
    './css/style.min.css',
    './js/main.min.js',
    './js/theme-switcher.min.js'
];

// Install Event
self.addEventListener('install', event => {
    self.skipWaiting(); // Activate worker immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of all clients immediately
});

// Fetch Event
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 1. Cache First for Static Assets (Images, Fonts, CSS, JS)
    // Matches: .png, .jpg, .webp, .svg, .ttf, .woff2, .css, .js
    if (url.pathname.match(/\.(ttf|woff2?|png|jpg|jpeg|webp|svg|css|js)$/i)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then(networkResponse => {
                    // Check if valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Cache the new resource
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                });
            })
        );
        return;
    }

    // 2. Google Fonts Caching (Cache First for Fonts, Stale-While-Revalidate for CSS)
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    // Return cached response immediately if available
                    if (cachedResponse) {
                        // Update cache in background for CSS, but keep fonts (immutable)
                        if (url.origin === 'https://fonts.googleapis.com') {
                            fetch(event.request).then(networkResponse => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                        return cachedResponse;
                    }

                    return fetch(event.request).then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // 3. Network First for HTML (Navigation)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match('./index.html');
                })
        );
        return;
    }

    // Default: Network only
    // event.respondWith(fetch(event.request));
});
