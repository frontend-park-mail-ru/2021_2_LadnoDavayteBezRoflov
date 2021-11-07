'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardActionTypes = {
    CARD_GET: 'cards/get',
    CARD_CREATE: 'cards/create',
    CARD_UPDATE: 'card/update',
    CARD_DELETE: 'card/delete',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardActions = {
    /**
     * Действие: запрос карточки.
     * @param {int} id - айди карточки.
     */
    getCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_GET,
            data: {id},
        });
    },

    /**
     * Действие: создание карточки.
     * @param {any} data
     */
    createCard(data) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_CREATE,
            data,
        });
    },

    /**
     * Действие: обновление карточки.
     * @param {any} data
     */
    updateCard(data) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_UPDATE,
            data,
        });
    },

    /**
     * Действие: удаление карточки
     * @param {int} id - айди карточки.
     */
    deleteCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE,
            data: {id},
        });
    },
};
