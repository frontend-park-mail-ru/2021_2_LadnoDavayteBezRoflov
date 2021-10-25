import BaseStore from '../BaseStore.js';

// Actions
import {UserActionTypes} from '../../actions/user.js';

// Modules
import Network from '../../modules/Network/Network.js';
import Validator from '../../modules/Validator/Validator.js';

// Constants
import {ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';

/**
 * Класс, реализующий хранилище пользователя
 */
class UserStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('User');

        this._channel = 'User';

        this._storage = new Map();

        this._storage.set('isAuthorized', undefined);
        this._storage.set('userName', undefined);
        this._storage.set('status', undefined);

        this._storage.set('validation', Object({login: undefined, password: undefined}));

        this._storage.set('userLoginInput', undefined);
    }

    /**
     * Метод, возвращающий текущее состояние (контекст) хранилища.
     * @param {String | undefined} field возвращаемое поле
     * @return {String} контекст хранилища
     */
    getContext(field) {
        return (field === undefined)? this._storage : this._storage.get(field);
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case UserActionTypes.USER_FETCH:
            await this._fetchUser();
            this._emitChange(); // +field
            break;

        case UserActionTypes.USER_REGISTER:
            await this._register(action.data);
            this._emitChange(); // +field
            break;

        case UserActionTypes.USER_LOGIN:
            await this._login(action.data);
            this._emitChange(); // +field
            break;

        case UserActionTypes.USER_LOGOUT:
            await this._logout();
            this._emitChange(); // +field
            break;

        default:
            return;
        }
    }

    /**
     * Метод, реализующий реакцию на инициализацию.
     */
    async _fetchUser() {
        let payload;

        try {
            payload = await Network.getUser();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('userName', payload.data);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
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
        let payload;

        try {
            payload = await Network.sendRegistration(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }
        this._storage.set('status', payload.status);

        switch (payload.status) {
        case HttpStatusCodes.Created:
            this._storage.set('userName', payload.data.login);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
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
        this._storage.set('userLoginInput', data);
        this._storage.set('status', null);

        this._validate(data);

        if (!this.__validationPassed()) {
            return;
        }

        let payload;

        try {
            payload = await Network.sendAuthorization(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }
        this._storage.set('status', payload.status);

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('userName', data.login);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            this._storage.set('userLoginInput', undefined);
            this._storage.get('validation')['login'] = {error: true,
                                                        message: ConstantMessages.WrongCredentials};
            this._storage.get('validation')['password'] = {error: true,
                                                           message: ConstantMessages.WrongCredentials};
            return;

        default:
            console.log('Undefined error');
            this._storage.get('validation')['login'] = {error: true,
                                                        message: ConstantMessages.UnableToLogin};
        }
    }

    /**
     * Метод, реализующий реакцию на выход.
     */
    async _logout() {
        let payload;

        try {
            payload = await Network.sendLogout();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }
        this._storage.set('status', payload.status);

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, переводящий хранилище в состояние "не вошел в аккаунт".
     */
    __logout() {
        this._storage.set('userName', null);
        this._storage.set('isAuthorized', false);
        this._storage.set('status', HttpStatusCodes.Unauthorized);
        this._emitChange();
    }

    /**
     * Метод, осуществляющий валидацию данных.
     * @param {object} data объект, содержащий данные из формы
     */
    _validate(data) {
        const validator = new Validator();

        this._storage.get('validation')['login'] = validator.validateLogin(data.login);
        this._storage.get('validation')['password'] = validator.validatePassword(data.password);
    }

    /**
     * Метод, проверяющий, корректны ли все данные (пройдена ли валидация).
     * @return {boolean} статус валидации
     */
    __validationPassed() {
        let isValid = true;
        Object.values(this._storage.get('validation')).forEach((element) => {
            if (element.error) {
                isValid = false;
            }
        });
        return isValid;
    }
}

export default new UserStore();
