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
        this._storage.set('isAuthorized', undefined);
        this._storage.set('userName', undefined);

        this._storage.set('validation', {
            userLoginData:
            {
                login: undefined,
                password: undefined,
            },

            userRegisterData:
            {
                login: undefined,
                email: undefined,
                password: undefined,
                passwordRepeat: undefined,
            },
        });

        this._storage.set('userLoginData', undefined);
        this._storage.set('userRegisterData', undefined);
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
        let response;

        try {
            response = await Network.getUser();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (response.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('userName', response.data);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            return;

        default:
            console.log('Undefined error');
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
        }
    }

    /**
     * Метод, реализующий реакцию на регистрацию.
     * @param {Object} data данные для входа
     */
    async _register(data) {
        this._storage.set('userRegisterData', data);
        this._validate(data, 'userRegisterData');

        if (!this.__validationPassed('userRegisterData')) {
            return;
        }

        let response;

        try {
            response = await Network.sendRegistration(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (response.status) {
        case HttpStatusCodes.Created:
            this._storage.set('userName', response.data.login);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            this._storage.set('userRegisterData', undefined);

            this._storage.get('validation').userRegisterData ={
                login: ConstantMessages.UnableToRegister,
                email: null,
                password: null,
                passwordRepeat: null,
            };
            return;

        default:
            console.log('Undefined error');
            this._storage.get('validation').userRegisterData.login = ConstantMessages.UnableToRegister;
        }
    }

    /**
     * Метод, реализующий реакцию на вход.
     * @param {Object} data данные для входа
     */
    async _login(data) {
        this._storage.set('userLoginData', data);

        this._validate(data, 'userLoginData');

        if (!this.__validationPassed('userLoginData')) {
            return;
        }

        let response;

        try {
            response = await Network.sendAuthorization(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (response.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('userName', response.data.login);
            this._storage.set('isAuthorized', true);
            return;

        case HttpStatusCodes.Unauthorized:
            this._storage.set('userName', null);
            this._storage.set('isAuthorized', false);
            this._storage.set('userLoginData', undefined);

            this._storage.get('validation').userLoginData = {
                login: ConstantMessages.WrongCredentials,
                password: ConstantMessages.WrongCredentials,
            };

            return;

        default:
            console.log('Undefined error');
            this._storage.get('validation').userLoginData.login = ConstantMessages.UnableToLogin;
        }
    }

    /**
     * Метод, реализующий реакцию на выход.
     */
    async _logout() {
        let response;

        try {
            response = await Network.sendLogout();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (response.status) {
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
        this._emitChange();
    }

    /**
     * Метод, осуществляющий валидацию данных.
     * @param {object} data объект, содержащий данные из формы
     * @param {String} form обрабатываемая форма
     */
    _validate(data, form) {
        const validator = new Validator();

        const validation = this._storage.get('validation')[form];

        validation.login = validator.validateLogin(data.login);
        if (!!validation.login) {
            this._storage.get(form).login = '';
        }

        validation.password = validator.validatePassword(data.password);
        if (!!validation.password) {
            this._storage.get(form).password = '';
        }

        if (data.hasOwnProperty('email')) {
            validation.email = validator.validateEMail(data.email);
            if (!!validation.email) {
                this._storage.get(form).email = '';
            }
        }

        if (data.hasOwnProperty('passwordRepeat') && (data.password !== data.passwordRepeat)) {
            validation.passwordRepeat = ConstantMessages.NonMatchingPasswords;
            this._storage.get(form).passwordRepeat = '';
        }
    }

    /**
     * Метод, проверяющий, корректны ли все данные (пройдена ли валидация).
     * @param {String} form обрабатываемая форма
     * @return {boolean} статус валидации
     */
    __validationPassed(form) {
        let isValid = true;
        Object.values(this._storage.get('validation')[form]).forEach((element) => {
            if (element) {
                isValid = false;
            }
        });
        return isValid;
    }
}

export default new UserStore();
