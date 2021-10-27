'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardActionTypes = {
    CARD_GET: 'cards/get',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardActions = {
    /**
     * Действие: запрос списка досок.
     */
    getCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_GET,
            data: {
                id: id,
            },
        });
    },
};

export default cardActions;
