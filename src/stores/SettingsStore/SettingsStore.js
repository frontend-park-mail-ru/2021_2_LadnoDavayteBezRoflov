import BaseStore from '../BaseStore.js';

// Actions
import {SettingsActionTypes} from '../../actions/settings.js';
import userActions from '../../actions/user.js';

// Modules
import Network from '../../modules/Network/Network.js';
import Validator from '../../modules/Validator/Validator.js';

// Constants
import {HttpStatusCodes} from '../../constants/constants.js';

/**
 * Класс, реализующий хранилище настроек.
 */
class SettingsStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('Settings');

        this._channel = 'Settings';

        this._storage = new Map();

        this._storage.set('validation', {
            login: undefined,
            email: undefined,
            password: undefined,
            passwordRepeat: undefined,
        });

        this._storage.set('userSettingsData', undefined);
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case SettingsActionTypes.SETTINGS_GET:
            await this._get(action.data);
            this._emitChange();
            break;

        case SettingsActionTypes.SETTINGS_UPDATE:
            await this._put(action.data);
            this._emitChange();
            break;

        default:
            return;
        }
    }

    /**
     * Метод, реализующий реакцию на запрос свежих настроек.
     * @param {Object} data данные запроса.
     */
    async _get(data) {
        if (data.userName === undefined) {
            return;
        }

        let payload;

        try {
            payload = await Network.getSettings(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('login', payload.data.login);
            this._storage.set('email', payload.data.email);
            this._storage.set('avatar', payload.data.avatar);
            return;

        case HttpStatusCodes.Unauthorized:
            userActions.logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на обновление настроек.
     * @param {Object} data данные запроса.
     */
    async _put(data) {
        this._storage.set('userSettingsData', {
            login: data.get('login'),
            email: data.get('email'),
            password: data.get('password'),
            passwordRepeat: data.get('passwordRepeat'),
            avatar: undefined,
        });

        if (data.get('avatar').size > 500 * 1024 ) {
            this._storage.get('validation').avatar = 'SettingsStore: аватарка слишком большая';
        }

        if (data.get('avatar').size !== 0) {
            if (typeof data.get('avatar') !== File) {
                const avatarBlob = data.get('avatar');
                data.set('avatar', new File([avatarBlob], 'avatar'));
                this._storage.get('userSettingsData').avatar = avatarBlob;
            } else {
                this._storage.get('userSettingsData').avatar = URL.createObjectURL(data.get('avatar'));
            }
        }

        this._validate(data);

        if (!this.__validationPassed()) {
            return;
        }

        let payload;

        try {
            payload = await Network.putSettings(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('login', data.get('login'));
            this._storage.set('email', data.get('email'));
            this._storage.set('avatar', payload.data.avatar);
            this._emitChange();
            return;

        case HttpStatusCodes.NotMofidied:
            this._storage.set('validation', {
                login: ConstantMessages.BadRequest,
                email: null,
                password: null,
                passwordRepeat: null,
            });
            this._emitChange();
            return;

        case HttpStatusCodes.BadRequest:
            this._storage.set('validation', {
                login: ConstantMessages.BadRequest,
                email: null,
                password: null,
                passwordRepeat: null,
            });
            this._emitChange();
            return;

        case HttpStatusCodes.Unauthorized:
            userActions.logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, осуществляющий валидацию данных.
     * @param {object} data объект, содержащий данные из формы
     */
    _validate(data) {
        const validator = new Validator();

        const validation = this._storage.get('validation');

        validation.login = validator.validateLogin(data.get('login'));
        if (!!validation.login) {
            this._storage.get('userSettingsData').login = '';
        }

        validation.password = validator.validatePassword(data.get('password'));
        if (!!validation.password) {
            this._storage.get('userSettingsData').password = '';
        }

        validation.email = validator.validateEMail(data.get('email'));
        if (!!validation.email) {
            this._storage.get('userSettingsData').email = '';
        }

        if (data.password !== data.passwordRepeat) {
            validation.passwordRepeat = ConstantMessages.NonMatchingPasswords;
            this._storage.get('userSettingsData').passwordRepeat = '';
        }
    }

    /**
     * Метод, проверяющий, корректны ли все данные (пройдена ли валидация).
     * @return {boolean} статус валидации
     */
    __validationPassed() {
        let isValid = true;
        Object.values(this._storage.get('validation')).forEach((element) => {
            if (element) {
                isValid = false;
            }
        });
        return isValid;
    }
}

export default new SettingsStore();
