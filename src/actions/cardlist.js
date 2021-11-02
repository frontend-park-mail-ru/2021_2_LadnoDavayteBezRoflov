'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardListActionTypes = {
    CARDLIST_GET: 'cardlists/get',
    CARDLIST_CREATE: 'cardlists/create',
    CARDLIST_UPDATE: 'cardlists/update',
    CARDLIST_DELETE: 'cardlists/delete',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardListActions = {
    /**
     * Действие: запрос списка досок.
     * @param {int} id - айди списка досок
     */
    getCardList(id) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARDLIST_CREATE,
            data: {
                id: id,
            },
        });
    },

    // TODO cardlist: create, update, delete

};
