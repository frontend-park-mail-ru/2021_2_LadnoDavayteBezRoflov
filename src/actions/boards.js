'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const BoardsActionTypes = {
    BOARDS_GET: 'boards/get',
    BOARD_GET: 'board/get',
    BOARDS_CREATE: 'boards/create',
    BOARDS_POPUP_SHOW: 'boards/popup/show',
    BOARDS_POPUP_HIDE: 'boards/popup/hide',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const boardsActions = {
    /**
     * Действие: запрос списка досок.
     */
    getBoards() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_GET,
        });
    },

    /**
     * Действие: запрос доски с определенным id.
     * @param {any} id
     */
    getBoard(id) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARD_GET,
            data: {id},
        });
    },

    /**
     * Действие: создание доски.
     * @param {String} name - название доски
     * @param {int} teamID - номер команды
     */
    createBoard(name, teamID) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_CREATE,
            data: {
                name,
                teamID,
            },
        });
    },

    /**
     * Действие: открытие модального окна для команды.
     * @param {int} teamID - номер команды
     */
    showModal(teamID) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_POPUP_SHOW,
            data: {
                teamID,
            },
        });
    },

    hidePopUp() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_POPUP_HIDE,
        });
    },
};
