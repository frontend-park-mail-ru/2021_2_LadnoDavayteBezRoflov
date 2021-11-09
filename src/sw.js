import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    /\.css$/,
    new CacheFirst({
        cacheName: 'css-cache',
    }),
);

registerRoute(
    /\.js/,
    new CacheFirst({
        cacheName: 'js-cache',
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
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 дней
            }),
        ],
    }),
);

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
