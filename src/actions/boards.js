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
    BOARDS_ADD_MEMBER_SHOW: 'boards/member/show',
    BOARDS_ADD_MEMBER_CLOSE: 'boards/member/close',
    BOARDS_ADD_MEMBER_INPUT: 'boards/member/input',
    BOARDS_ADD_MEMBER_USER_CLICKED: 'boards/member/clicked',
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
     * @param {Number} tid - номер команды
     */
    createBoard(name, tid) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_CREATE,
            data: {
                name,
                tid,
            },
        });
    },

    /**
     * Действие: открытие модального окна для команды.
     * @param {Number} tid - номер команды
     */
    showModal(tid) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_POPUP_SHOW,
            data: {
                tid,
            },
        });
    },

    hidePopUp() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_POPUP_HIDE,
        });
    },

    /**
     * Отобразить popup добавления пользователя в команду
     * @param {Number} tid - id команды
     */
    showAddTeamMemberPopUp(tid) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_ADD_MEMBER_SHOW,
            data: {
                tid,
            },
        });
    },

    /**
     * Скрыть popup добавления пользователя на карточку
     */
    hideAddTeamMemberPopUp() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_ADD_MEMBER_CLOSE,
        });
    },

    /**
     * Обновить список пользователей на основании ввода пользователя
     * @param {String} searchString - строка для поиска
     */
    refreshTeamSearchList(searchString) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_ADD_MEMBER_INPUT,
            data: {searchString},
        });
    },

    /**
     * Добаваить/исключить пользователя из доски
     * @param {Number} uid - id пользователя
     */
    toggleUserInSearchList(uid) {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_ADD_MEMBER_USER_CLICKED,
            data: {uid},
        });
    },
};
