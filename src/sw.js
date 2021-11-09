importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');
//import WorkboxPrecaching from 'workbox-precaching';

      
    workbox.routing.registerRoute(
        /\.css$/,
        new workbox.strategies.CacheFirst({
          cacheName: 'css-cache',
        })
    );
      
    workbox.routing.registerRoute(
        /\.js/,
        new workbox.strategies.CacheFirst({
          cacheName: 'js-cache',
        })
    );

    workbox.routing.registerRoute(
        /\.(?:woff2|eot|svg|ttf|woff|otf)$/,
        new workbox.strategies.CacheFirst({
          cacheName: 'font-cache',
        })
    );

    workbox.routing.registerRoute(
        /\.webp/,
        new workbox.strategies.CacheFirst({
          cacheName: 'image-cache',
          plugins: [
            new workbox.expiration.Plugin({
              maxEntries: 50,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 дней
            })
          ],
        })
    );

    workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
/* 
const CACHE_NAME = 'LDBR_Cache';
const {assets} = global.serviceWorkerOption;

const cacheUrls = [
    './',
    './index.js',
    './index_template.html',
    '/public/offline.html',
    ...assets,
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(cacheUrls);
            })
            .catch((error) => {
                console.error("Cache error: ", error);
                throw error;
            }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (!navigator.onLine && response) {
                    if (event.request.method !== 'GET') {
                        return response;
                    }
                }
                return fetch(event.request)
                    .then((res) => {
                        caches
                            .open(CACHE_NAME)
                            .then((cache) => {
                                return cache.put(request, res.clone());
                            });
                        return res;
                    })
                    .catch(() => {
                        return null;
                    });
            })
            .catch(() => {
                return caches.match('/public/offline.html');
            })
    );
});
 */