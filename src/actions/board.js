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
    BOARD_ADD_MEMBER_SHOW: 'board/member/show',
    BOARD_ADD_MEMBER_CLOSE: 'board/member/close',
    BOARD_ADD_MEMBER_INPUT: 'board/member/input',
    BOARD_ADD_MEMBER_USER_CLICKED: 'board/member/clicked',
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
     * @param {String} boardName
     * @param {String} description
     */
    updateBoardTitleDescription(boardName, description) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.POPUP_BOARD_UPDATE,
            data: {
                board_name: boardName,
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
                confirmed,
            },
        });
    },

    /**
     * Отобразить popup добавления пользователя в доску
     */
    showAddBoardMemberPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.BOARD_ADD_MEMBER_SHOW,
        });
    },

    /**
     * Скрыть popup добавления пользователя на карточку
     */
    hideAddBoardMemberPopUp() {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.BOARD_ADD_MEMBER_CLOSE,
        });
    },

    /**
     * Обновить список пользователей на основании ввода пользователя
     * @param {String} searchString - строка для поиска
     */
    refreshUserSearchList(searchString) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.BOARD_ADD_MEMBER_INPUT,
            data: {searchString},
        });
    },

    /**
     * Добаваить/исключить пользователя из доски
     * @param {Number} uid - id пользователя
     */
    toggleUserInSearchList(uid) {
        Dispatcher.dispatch({
            actionName: BoardActionTypes.BOARD_ADD_MEMBER_USER_CLICKED,
            data: {uid},
        });
    },
};
