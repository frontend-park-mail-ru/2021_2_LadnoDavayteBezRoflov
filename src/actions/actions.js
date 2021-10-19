'use strict';

// Типы действий
import ActionTypes from './actionTypes.js';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Класс, содержащий в себе действия в системе.
 */
class Actions {
    /**
     * Действие: инициализация пользователя.
     */
    init() {
        Dispatcher.dispatch({
            actionName: ActionTypes.USER_INIT,
            data: {
            },
        });
    }

    /**
     * Действие: регистрация пользователя.
     * @param {String} login
     * @param {String} email
     * @param {String} password
     */
    register(login, email, password) {
        Dispatcher.dispatch({
            actionName: ActionTypes.USER_REGISTER,
            data: {
                login: login,
                email: email,
                password: password,
            },
        });
    }

    /**
     * Действие: вход пользователя.
     * @param {String} login
     * @param {String} password
     */
    login(login, password) {
        Dispatcher.dispatch({
            actionName: ActionTypes.USER_LOGIN,
            data: {
                login: login,
                password: password,
            },
        });
    }

    /**
     * Действие: выход из аккаунта пользователя.
     */
    logout() {
        Dispatcher.dispatch({
            actionName: ActionTypes.USER_LOGOUT,
            data: {
            },
        });
    }
}

export default new Actions();
