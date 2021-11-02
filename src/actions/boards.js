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
    BOARDS_MODAL_SHOW: 'boards/modal/show',
    BOARDS_MODAL_HIDE: 'boards/modal/hide',
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
            data: {
                id: id,
            },
        });
    },

    createBoard(name, teamID) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_CREATE,
            data: {
                name: name,
                teamID: teamID,
            },
        });
    },

    showModal(teamID) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_MODAL_SHOW,
            data: {
                teamID,
            },
        });
    },

    hideModal() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_MODAL_HIDE,
        });
    },
};
