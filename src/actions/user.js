'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий.
 */
export const UserActionTypes = {
    USER_FETCH: 'user/fetch',
    USER_REGISTER: 'user/register',
    USER_LOGIN: 'user/login',
    USER_LOGOUT: 'user/logout',

};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const userActions = {
    /**
     * Действие: инициализация пользователя.
     */
    fetchUser() {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_FETCH,
        });
    },

    /**
     * Действие: регистрация пользователя.
     * @param {String} login
     * @param {String} email
     * @param {String} password
     * @param {String} passwordRepeat
     */
    register(login, email, password, passwordRepeat) {
        Dispatcher.dispatch({
            actionName: UserActionTypes.USER_REGISTER,
            data: {
                login: login,
                email: email,
                password: password,
                passwordRepeat: passwordRepeat,
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

};

export default userActions;
