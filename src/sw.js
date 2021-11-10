import {CacheFirst, StaleWhileRevalidate, NetworkOnly} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute, setCatchHandler} from 'workbox-routing';

precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'general';
const FALLBACK_HTML_URL = '/offline.html';

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

registerRoute(
    /\.css$/,
    new CacheFirst({
        cacheName: 'css-cache',
    }),
);

registerRoute(
    /\.js/,
    new NetworkOnly({
        cacheName: 'js-cache',
        plugins: [
            {fetchDidFail: () => caches.match(FALLBACK_HTML_URL)},
        ],
    }),
);

registerRoute(
    /\.(?:woff2|eot|svg|ttf|woff|otf)$/,
    new CacheFirst({
        cacheName: 'font-cache',
    }),
);

registerRoute(
    /\.webp/,
    new StaleWhileRevalidate({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 дней
            }),
            {fetchDidFail: () => caches.match(FALLBACK_HTML_URL)},
        ],
    }),
);

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

setCatchHandler(async ({event}) => {
    // TODO fallback'и на image, fonts
    switch (event.request.destination) {
    default:
        return caches.match(FALLBACK_HTML_URL);
    }
});
