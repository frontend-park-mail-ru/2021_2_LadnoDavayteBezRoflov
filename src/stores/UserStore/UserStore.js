'use strict';

import BaseStore from '../BaseStore.js';
import ActionTypes from '../../actions/actionTypes.js';

import Network from '../../modules/Network/Network.js';
import {HttpStatusCodes} from '../../constants/constants.js';

/**
 * Класс, реализующий хранилище пользователя
 */
class UserStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super();

        this._isAuthorized = false;
        this._userName = undefined; // make map

        // enum for fields - model
    }

    /**
     * Метод, возвращающий текущее состояние (контекст) хранилища.
     * @return {String} контекст хранилища
     */
    getContext() {
        return {isAuthorized: this._isAuthorized, userName: this._userName};
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case ActionTypes.USER_INIT:
            await this._init();
            break;

        case ActionTypes.USER_REGISTER:
            await this._register(action.data);
            break;

        case ActionTypes.USER_LOGIN:
            await this._login(action.data);
            break;

        case ActionTypes.USER_LOGOUT:
            this._logout();
            break;

        default:
            return;
        }
        this._emitChange(); // +field
    }

    /**
     * Метод, реализующий реакцию на инициализацию.
     */
    async _init() {
        let payload;

        try {
            payload = await Network.getUser();
            if (payload.length > 2) {
                throw new Error('UserStore: метод _initUser не получил корректного ответа');
            }
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload[0]) {
        case HttpStatusCodes.Ok:
            this._userName = payload[1];
            this._isAuthorized = true;
            return;

        case HttpStatusCodes.Unauthorized:
            this._userName = null;
            this._isAuthorized = false;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на регистрацию.
     * @param {Object} data данные для входа
     */
    async _register(data) {
        const [statusCode] = await Network.sendRegistration(data);
        switch (statusCode) {
        case HttpStatusCodes.Created:
            this._userName = data.login;
            this._isAuthorized = true;
            return;

        case HttpStatusCodes.Unauthorized:
            this._userName = null;
            this._isAuthorized = false;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на вход.
     * @param {Object} data данные для входа
     */
    async _login(data) {
        const [statusCode] = await Network.sendAuthorization(data);

        console.log(statusCode);

        switch (statusCode) {
        case HttpStatusCodes.Ok:
            this._userName = data.login;
            this._isAuthorized = true;
            return;

        case HttpStatusCodes.Unauthorized:
            this._userName = null;
            this._isAuthorized = false;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на выход.
     */
    async _logout() {
        const [statusCode] = await Network.sendLogout();

        switch (statusCode) {
        case HttpStatusCodes.Ok:
            this._userName = null;
            this._isAuthorized = false;
            this._changed = true;
            return;

        case HttpStatusCodes.Unauthorized:
            this._userName = null;
            this._isAuthorized = false;
            return;

        default:
            console.log('Undefined error');
        }
    }
}

export default new UserStore();
