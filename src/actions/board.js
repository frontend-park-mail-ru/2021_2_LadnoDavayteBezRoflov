'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const BoardActionTypes = {
    // Открыть popup настройки доски
    POPUP_BOARD_SHOW: 'board/popup/board/show',
    // Закрыть popup настройки доски
    POPUP_BOARD_HIDE: 'board/popup/board/hide',
    // Кнопка обновить (название + описание доски)
    POPUP_BOARD_UPDATE: 'board/popup/board/update',
    // Отобразить диалог подтверждения удаления доски
    POPUP_BOARD_DELETE_SHOW: 'board/popup/delete/show',
    // Закрытие диалога подтверждения удаления доски (нажато да/нет)
    POPUP_BOARD_DELETE_HIDE: 'board/popup/delete/hide',

    // Отобразить popup создание CL
    POPUP_CARD_LIST_CREATE_SHOW: 'board/popup/cardlist/create/show',
    // Скрыть popup создания CL
    POPUP_CARD_LIST_CREATE_HIDE: 'board/popup/cardlist/create/hide',
    // Кнопка создать CL
    POPUP_CARD_LIST_CREATE_SUBMIT: 'board/popup/cardlist/create/submit',
};

/**
 * Класс, содержащий в себе действия, иницируемые с BoardView.
 */
export const boardActions = {

    /**
     * Отобразить popup настроек доски
     */
    showBoardSettingsPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_SHOW,
        });
    },

    /**
     * Скрыть popup с настройками доски
     */
    hideBoardSettingsPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_HIDE,
        });
    },

    /**
     * Обновить заглавие и описание доски
     * @param {String} title
     * @param {String} description
     */
    updateBoardTitleDescription(title, description) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_UPDATE,
            data: {
                title,
                description,
            },
        });
    },

    /**
     * Отобразить диалог подтверддения удаления доски
     */
    showConfirmDeleteBoard() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_DELETE_SHOW,
        });
    },

    /**
     * Закрыть диалог подтверждения удаления доски
     * @param {Boolean} confirmed - подтверждено или нет удаление доски
     */
    hideConfirmDeleteBoard(confirmed) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_DELETE_HIDE,
            data: {
                confirmed
            },
        });

    },


    /**
     * Действие: показать popup создания списка карточек
     */
    showCardListPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_CREATE_SHOW,
        });
    },

    /**
     * Скрыть popup создания списка карточек.
     */
    hideCardListPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_CREATE_HIDE,
        });
    },

    /**
     * Создать список карточек
     * @param {String} title - имя списка карточек
     */
    createCardList(title) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_CARD_LIST_CREATE_SUBMIT,
            data: {
                name,
            },
        });
    },
};
