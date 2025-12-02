const CACHE_NAME = 'elite-fit-cache-v3';

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

// Fetch Event - CACHING DISABLED
self.addEventListener('fetch', event => {
    // Network Only strategy for development
    event.respondWith(fetch(event.request));
});
