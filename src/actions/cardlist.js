'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardListActionTypes = {
    CARDLIST_CREATE: 'cardlists/create',
    CARDLIST_UPDATE: 'cardlists/update',
    CARDLIST_DELETE: 'cardlists/delete',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardListActions = {
    /**
     * Действие: создание списка карточек.
     * @param {String} title - название списка карточек
     */
    createCardList(title) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARDLIST_CREATE,
            data: {title},
        });
    },

    /**
     * Действие: обновление списка карточек.
     * @param {String} title - название списка карточек
     * @param {int} position - позиция на доске
     */
    updateCardList(title) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARDLIST_UPDATE,
            data: {
                title,
                position,
            },
        });
    },

    /**
     * Действие: удаление списка карточек.
     * @param {int} clid - айди списка карточек
     */
    deleteCardList(clid) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARDLIST_CREATE,
            data: {clid},
        });
    },
};
