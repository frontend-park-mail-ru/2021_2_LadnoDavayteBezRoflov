'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для собыйтий от sw.
 */
export const ServiceWorkerTypes = {
    HALF_OFFLINE: 'half-offline',
    FULL_OFFLINE: 'full-offline',
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
            actionName: ServiceWorkerTypes.OFFLINE,
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
};
