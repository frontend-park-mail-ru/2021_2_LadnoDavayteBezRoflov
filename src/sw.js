import {ServiceWorker} from './constants/constants';

const STATIC_FILES_URL = (self.__WB_MANIFEST || []).map((pair) => {
    return pair.url;
});

self.addEventListener('install', async (event) => {
    console.log('SW: Установлен');
    const cache = await caches.open(ServiceWorker.STATIC_CACHE_NAME);
    await cache.addAll(STATIC_FILES_URL);
    await caches.open(ServiceWorker.API_CACHE_NAME);
});

self.addEventListener('activate', async (event) => {
    /* Удалим устаревшии версии кэша: */
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.filter((name) =>
            name !== ServiceWorker.STATIC_CACHE_NAME ||
            name !== ServiceWorker.API_CACHE_NAME).map((name) => caches.delete(name)),
    );
});

self.addEventListener('fetch', (event) => {
    const {request} = event;
    console.log('SW: Происходит запрос на сервер: ' + request.url);
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api')) { // Запрос на API
        console.log('запрос на api');
        event.respondWith(networkFirst(request));
    } else if (event.request.mode === 'navigate') { // Переход по URL в адресной строке
        console.log('запрос через location');
        event.respondWith(cacheFirst(ServiceWorker.HTML_URL));
    } else { // Запрос за статикой
        console.log('запрос за статикой');
        event.respondWith(cacheFirst(request));
    }
});

/**
 * CacheFirst
 * @param {Request | String} request объект запроса или URL строка
 * @return {Promise<Response<any, Record<string, any>, number>>} фыв
 */
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        const response = await fetch(request);
        const cache = await caches.open(ServiceWorker.STATIC_CACHE_NAME);
        await cache.put(request, response);
        return response;
    } catch (error) {
        console.log('[SW] cacheFirst: нет сети или проблемы с кэшем');
        // todo попробовать отдать offline, если запрашивали с location
    }
}

/**
 *
 * @param {Request | String} request объект запроса или URL строка
 * @return {Promise<Response>}
 */
async function networkFirst(request) {
    /**
     * 1. Идем в сеть, если все ок - кэшируем ответ и отвечаем
     * 2. Если поход не удался - проверяем запрос в кэше
     * 2.1 Запрос найден - отдаем его с пометкой "кэш". Прослойка сети проверяет этот флаг и шлет экшен
     * "cahed page" - рисуется плашка с предупреждением что мы оффлайн. Все заинтересованные сторы переключают логику,
     * например, может быть выставлен флаг и для попапов (едиснтвенные "точки" редактирования) не будут выполняться обработчики.. либо надписи - "оффлан будут".
     * 2.2 Запрос не найден - помечаем что нужно отобразить offline page.
     *     В приложении шлем экшон "offline", а в нем редиректим на оффлан вью.
     *     В сетевых запросах - ничего не делаем
     *
     */
    const cache = await caches.open(ServiceWorker.API_CACHE_NAME);
    try {
        const response = await fetch(request);

        /* Добавим служебный заголовок, позволяющий определить что запрос был кэширован в SW*/
        const headers = new Headers(response.headers);
        headers.set('X-Is-From-Service-Worker', 'true');

        const responseBytes = await response.blob();
        const cachedResponse = new Response(responseBytes, {
            status: response.status,
            statusText: response.statusText,
            headers: headers,
        });
        await cache.put(request, cachedResponse);

        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        return cachedResponse; // todo no internet. Go /offline
    }
}
