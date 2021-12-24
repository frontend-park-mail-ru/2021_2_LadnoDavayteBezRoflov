import {ServiceWorker} from './constants/constants';

const STATIC_FILES_URL = (self.__WB_MANIFEST || []).map((pair) => {
    return pair.url;
});

self.addEventListener('install', async (event) => {
    await caches.open(ServiceWorker.API_CACHE_NAME);
    const cache = await caches.open(ServiceWorker.STATIC_CACHE_NAME);
    await cache.addAll(STATIC_FILES_URL);
});

self.addEventListener('activate', async (event) => {
    /* Удалим устаревшии версии кэша: */
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== ServiceWorker.STATIC_CACHE_NAME)
            .filter((name) => name !== ServiceWorker.API_CACHE_NAME)
            .map((name) => caches.delete(name)),
    );
});

self.addEventListener('fetch', (event) => {
    const {request} = event;
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api')) { // Запрос на API
        event.respondWith(networkFirst(request, event.clientId, ServiceWorker.API_CACHE_NAME));
    } else if (event.request.mode === 'navigate') { // Переход по URL в адресной строке
        if (event.request.url.startsWith(ServiceWorker.ATTACHMENT_PREFIX)) {
            event.respondWith(fetchAttachment(request));
        }
        /* Всегда пытаемся получить свежую страницу с новыми бандлами */
        event.respondWith(networkFirst(request, event.clientId, ServiceWorker.STATIC_CACHE_NAME));
    } else { // Запрос за статикой
        event.respondWith(cacheFirst(request));
    }
});

/**
 * CacheFirst - кэширование
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
        if (request.url.endsWith('webp')) {
            return await caches.match(ServiceWorker.CacheUrls.NO_INTERNET_IMG_URL);
        }
    }
}

/**
 * NetworkFirst - кэширование запросов на API
 * @param {Request | String} request объект запроса или URL строка
 * @param {Number} clientId id клиента
 * @param {String} cacheName имя кэша
 * @return {Promise<Response>}
 */
async function networkFirst(request, clientId, cacheName) {
    if (request.method !== 'GET') {
        try {
            return await fetch(request);
        } catch (error) {
            return undefined;
        }
    }

    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        const responseCopy = response.clone();
        await sendMessage(clientId,
                          ServiceWorker.Messages.ONLINE,
                          request?.url);

        /* Добавим служебный заголовок, позволяющий определить что запрос был кэширован в SW*/
        const headers = new Headers(responseCopy.headers);
        headers.set('X-Is-From-Service-Worker', 'true');

        const responseBytes = await responseCopy.blob();
        const cachedResponse = new Response(responseBytes, {
            status: responseCopy.status,
            statusText: responseCopy.statusText,
            headers: headers,
        });
        await cache.put(request, cachedResponse);

        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (!cachedResponse) {
            await sendMessage(clientId,
                              ServiceWorker.Messages.OFFLINE_NO_CACHE,
                              request?.url);
            return undefined;
        }
        await sendMessage(clientId,
                          ServiceWorker.Messages.OFFLINE_FROM_CACHE,
                          request?.url);
        return cachedResponse;
    }
}

/**
 * Извлекает аттач, заменяет URL при запросе, добавляет хедер Content-Disposition в ответе
 * @param  {Request} request - request
 * @return {Promise<Response>}
 */
async function fetchAttachment(request) {
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(ServiceWorker.ATTACHMENT_PREFIX, '');
    const fileName = url.searchParams.get(ServiceWorker.ATTACH_NAME_PARAM);
    url.searchParams.delete(ServiceWorker.ATTACH_NAME_PARAM);
    try {
        const response = await fetch(url.toString());

        /* Добавим служебный заголовок, указывающий что контент нужно скачать */
        const headers = new Headers(response.headers);
        headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

        const responseBytes = await response.blob();
        const responseCopy = new Response(responseBytes, {
            status: responseCopy.status,
            statusText: responseCopy.statusText,
            headers: headers,
        });

        return responseCopy;
    } catch (error) {
        console.log('не удалость загрузить вложение: ' + request.url);
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
        return;
    }
    client.postMessage({
        messageType,
        clientId,
        url,
    });
}
