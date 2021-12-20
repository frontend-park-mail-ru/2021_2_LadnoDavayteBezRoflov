import {ServiceWorker} from './constants/constants';

const STATIC_FILES_URL = (self.__WB_MANIFEST || []).map((pair) => {
    return pair.url;
});

self.addEventListener('install', async (event) => {
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
        event.respondWith(networkFirst(request, event.clientId));
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
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.log('[SW] cacheFirst: нет сети или проблемы с кэшем');
        // todo попробовать отдать offline, если запрашивали с location
    }
}

/**
 *
 * @param {Request | String} request объект запроса или URL строка
 * @param {Number} clientId id клиента
 * @return {Promise<Response>}
 */
async function networkFirst(request, clientId) {
    const cache = await caches.open(ServiceWorker.API_CACHE_NAME);
    try {
        const response = await fetch(request);
        const responseCopy = response.clone();

        /* Добавим служебный заголовок, позволяющий определить что запрос был кэширован в SW*/
        const headers = new Headers(responseCopy.headers);
        headers.set('X-Is-From-Service-Worker', 'true');

        const responseBytes = await responseCopy.blob();
        const cachedResponse = new Response(responseBytes, {
            status: responseCopy.status,
            statusText: responseCopy.statusText,
            headers: headers,
        });

        //todo: if method put return
        await cache.put(request, cachedResponse);
        return response;
    } catch (error) {
        console.log(error);
        const cachedResponse = await cache.match(request);
        if (!cachedResponse) {
            await sendMessage(clientId,
                              ServiceWorker.Messages.OFFLINE_NO_CACHE,
                              request.url);
            return undefined;
        }
        await sendMessage(clientId,
                          ServiceWorker.Messages.OFFLINE_FROM_CACHE,
                          request.url);
        return cachedResponse;
    }
}

/**
 * Отправляет сообщение в приложение
 * @param {Number} clientId id клиента
 * @param {String} messageType сообщение
 * @param {String} url url связанный с сообщением
 * @return {Promise<void>}
 */
async function sendMessage(clientId, messageType, url) {
    const client = await clients.get(clientId);
    if (!client) {
        console.log('no client');
        return;
    }
    console.log('Post message: ' + messageType);
    client.postMessage({
        messageType,
        clientId,
        url,
    });
}
