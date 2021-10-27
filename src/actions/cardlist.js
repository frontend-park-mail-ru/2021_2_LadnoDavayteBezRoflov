'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardListActionTypes = {
    CARDLIST_GET: 'cardlists/get',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardListActions = {
    /**
     * Действие: запрос списка досок.
     */
    getCardList(id) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARDLIST_GET,
            data: {
                id: id,
            },
        });
    },
};

export default cardListActions;
