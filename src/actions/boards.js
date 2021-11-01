'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const BoardsActionTypes = {
    BOARDS_GET: 'boards/get',
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


    createBoard(name, teamID) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_CREATE,
            data: {
                name,
                teamID,
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
