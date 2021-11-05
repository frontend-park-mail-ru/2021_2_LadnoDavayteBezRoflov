'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const BoardActionTypes = {
    POPUP_BOARD_SHOW: 'board/popup/board/show', // Открыть popup настройки доски
    POPUP_BOARD_HIDE: 'board/popup/board/hide', // Закрыть popup настройки доски
    POPUP_BOARD_UPDATE: 'board/popup/board/update', // Кнопка обновить (название + описание доски)
    POPUP_BOARD_DELETE_SHOW: 'board/popup/delete/show', // Отобразить диалог подтверждения удаления
    POPUP_BOARD_DELETE_HIDE: 'board/popup/delete/hide', // Закрытие диалога подтверждения (нажато да/нет)

    POPUP_CARD_LIST_CREATE_SHOW: 'board/popup/cardlist/create/show', // Отобразить popup создание CL
    POPUP_CARD_LIST_CREATE_HIDE: 'board/popup/cardlist/create/hide', // Скрыть popup создания CL
    POPUP_CARD_LIST_CREATE_SUBMIT: 'board/popup/cardlist/create/submit', // Кнопка создать CL
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const boardActions = {
    /**
     * Действие: показать popup создания создания списка карточек.
     */
    cardListShowPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_SHOW,
        });
    },

    /**
     * Действие: скрыть popup создания списка карточек.
     */
    cardListHidePopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_HIDE,
        });
    },

    /**
     * Действие: создать card list
     * @param {String} name - имя списка карточек
     */
    cardListCreate(name) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_CREATE,
            data: {
                name,
            },
        });
    },


};
