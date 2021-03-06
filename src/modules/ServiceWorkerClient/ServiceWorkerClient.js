/**
 * Клиент для общения общения с SW
 */
import {ServiceWorker} from '../../constants/constants';
import {serviceWorkerActions} from '../../actions/serviceworker';

/**
 * Класс клиента для взаимодействия с SW
 */
export default class ServiceWorkerClient {
    /**
     * Конструирует клиента для общения общения с SW
     * @param {ServiceWorkerContainer} sw - объект sw container
     */
    constructor(sw) {
        this.sw = sw;
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (!event.data) {
                return;
            }
            switch (event.data.messageType) {
            case ServiceWorker.Messages.OFFLINE_FROM_CACHE:
                this._onResponseFromCache();
                break;

            case ServiceWorker.Messages.OFFLINE_NO_CACHE:
                this._onFullOffline();
                break;

            case ServiceWorker.Messages.ONLINE:
                this._onOnline();
                break;
            }
        });
    }

    /**
     * При получении ответа из кэша (отсутствует интернет)
     * @todo для разных запросов (передавать из SW) - разные actions
     * @private
     */
    _onResponseFromCache() {
        serviceWorkerActions.responseFromCache();
    }

    /**
     * При остутствии интернета и кэша на запросы
     * @private
     */
    _onFullOffline() {
        serviceWorkerActions.fullOffline();
    }

    /**
     * При получении запроса из сети
     * @private
     */
    _onOnline() {
        serviceWorkerActions.hideOfflineMessage();
    }
}
