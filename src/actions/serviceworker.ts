'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher';

/**
 * Константа, содержащая в себе типы действий для собыйтий от sw.
 */
export const ServiceWorkerTypes = {
    HALF_OFFLINE: 'half-offline',
    FULL_OFFLINE: 'full-offline',
    CLOSE_OFFLINE_MSG: 'close-offline',
    SHOW_OFFLINE_MSG: 'show-offline',
    HIDE_OFFLINE_MSG: 'hide-offline',
};

/**
 * Класс, содержащий в себе действия для работы с тегами.
 */
export const serviceWorkerActions = {

    /**
     * Отображает предупреждение об offline работе
     */
    responseFromCache() {
        Dispatcher.dispatch({
            actionName: ServiceWorkerTypes.HALF_OFFLINE,
        });
    },

    /**
     * Отображает offline страницу
     */
    fullOffline() {
        Dispatcher.dispatch({
            actionName: ServiceWorkerTypes.FULL_OFFLINE,
        });
    },

    /**
     * Сворачивает предупреждение об offline работе
     */
    onCloseOfflineMessage() {
        Dispatcher.dispatch({
            actionName: ServiceWorkerTypes.CLOSE_OFFLINE_MSG,
        });
    },

    /**
     * Разворачивает offline сообшение
     */
    onOpenOfflineMessage() {
        Dispatcher.dispatch({
            actionName: ServiceWorkerTypes.SHOW_OFFLINE_MSG,
        });
    },

    /**
     * Скрывает предупреждение об offline работе
     */
    hideOfflineMessage() {
        Dispatcher.dispatch({
            actionName: ServiceWorkerTypes.HIDE_OFFLINE_MSG,
        });
    },
};
