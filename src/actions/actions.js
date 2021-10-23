'use strict';

// Типы действий
import {UserActionTypes, BoardsActionTypes} from './actionTypes.js';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Класс, содержащий в себе действия в системе.
 */
const actions = {
    /**
     * Действие: инициализация пользователя.
     */
    init() {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_INIT,
        });
    },

    /**
     * Действие: регистрация пользователя.
     * @param {String} login
     * @param {String} email
     * @param {String} password
     */
    register(login, email, password) {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_REGISTER,
            data: {
                login: login,
                email: email,
                password: password,
            },
        });
    },

    /**
     * Действие: вход пользователя.
     * @param {String} login
     * @param {String} password
     */
    login(login, password) {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_LOGIN,
            data: {
                login: login,
                password: password,
            },
        });
    },

    /**
     * Действие: выход из аккаунта пользователя.
     */
    logout() {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_LOGOUT,
        });
    },

    getBoards() {
        Dispatcher.dispatch({
            actionName: BoardsActionTypes.BOARDS_GET,
        });
    },
};

export default actions;
