'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const BoardsActionTypes = {
    BOARDS_GET: 'boards/get',
    BOARD_GET: 'board/get',
    BOARD_CREATE: 'board/create',
    BOARD_UPDATE: 'board/update',
    BOARD_DELETE: 'board/delete',
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
     * @returns {any}
     */
    getBoard(id) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARD_GET,
            data: {
                id: id,
            },
        });
    },
};
