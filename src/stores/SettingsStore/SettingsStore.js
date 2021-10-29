import BaseStore from '../BaseStore.js';

// Actions
import {SettingsActionTypes} from '../../actions/settings.js';
import {userActions} from '../../actions/user.js';

// Modules
import Network from '../../modules/Network/Network.js';
import Validator from '../../modules/Validator/Validator.js';

// Constants
import {ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';

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
            login: null,
            email: null,
            password: null,
            passwordRepeat: null,
            avatar: null,
        });

        this._storage.set('userSettingsData', {
            login: undefined,
            email: undefined,
            password: undefined,
            passwordRepeat: undefined,
            avatar: undefined,
        });
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

        case SettingsActionTypes.AVATAR_UPLOAD:
            await this._uploadAvatar(action.data);
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
     * @param {FormData} data данные запроса.
     */
    async _put(data) {
        const formdata = data;

        this._storage.set('userSettingsData', {
            login: data.get('login'),
            email: data.get('email'),
            password: data.get('password'),
            passwordRepeat: data.get('passwordRepeat'),
            oldPassword: data.get('oldPassword'),
            avatar: data.get('avatar'),
        });

        this._validate(data);

        formdata.set('avatar', this.__setAvatar(data.get('avatar')));

        if (!this.__validationPassed()) {
            return;
        }

        let payload;

        try {
            payload = await Network.putSettings(formdata);
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
                login: ConstantMessages.NotModified,
                email: null,
                password: null,
                passwordRepeat: null,
                oldPassword: null,
            });
            this._emitChange();
            return;

        case HttpStatusCodes.BadRequest:
            this._storage.set('validation', {
                login: ConstantMessages.BadRequest,
                email: null,
                password: null,
                passwordRepeat: null,
                oldPassword: null,
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
     * Метод, реализующий реакцию на загрузку аватара.
     * @param {Object} data данные запроса.
     */
    async _uploadAvatar(data) {
        const validator = new Validator();

        if (data.avatar instanceof File) {
            if (data.avatar.size === 0) {
                throw new Error('SettingsStore: Ошибка загрузки аватара');
            }

            this._storage.get('validation').avatar = validator.validateAvatar(data.avatar);
            if (!!this._storage.get('validation').avatar) {
                this._storage.get('userSettingsData').avatar = '';
                return;
            }
        }

        this._storage.set('avatar', this.__setAvatar(data.avatar));
    }

    /**
     * Метод, осуществляющий валидацию данных.
     * @param {FormData} data FormData, содержащая данные из формы
     */
    _validate(data) {
        const validator = new Validator();

        const validation = this._storage.get('validation');

        validation.login = validator.validateLogin(data.get('login'));
        if (!!validation.login) {
            this._storage.get('userSettingsData').login = '';
        }

        validation.oldPassword = validator.validatePassword(data.get('oldPassword'));
        if (!!validation.oldPassword) {
            this._storage.get('userSettingsData').oldPassword = '';
        }

        if (!!data.get('password')) {
            validation.password = validator.validatePassword(data.get('password'));
            if (!!validation.password) {
                this._storage.get('userSettingsData').password = '';
            }
        }

        validation.email = validator.validateEMail(data.get('email'));
        if (!!validation.email) {
            this._storage.get('userSettingsData').email = '';
        }

        if (!!data.get('password')) {
            if (data.get('password') !== data.get('passwordRepeat')) {
                validation.passwordRepeat = ConstantMessages.NonMatchingPasswords;
                this._storage.get('userSettingsData').passwordRepeat = '';
            }
        }

        validation.avatar = validator.validateAvatar(data.get('avatar'));
        if (!!validation.avatar) {
            this._storage.get('userSettingsData').avatar = '';
        }
    }

    /**
     * Метод, проверяющий, корректны ли все данные (пройдена ли валидация).
     * @return {boolean} статус валидации
     */
    __validationPassed() {
        return Object.values(this._storage.get('validation')).every((element) => {
            return element === null;
        });
    }

    /**
     * Метод, проверяющий тип аватара:
     * File при загрузке или String на блоб, если файл уже был загружен
     * @param {String|File} avatar
     * @return {File|String} файл или адрес blob
     */
    __setAvatar(avatar) {
        if (avatar instanceof File) {
            if (avatar.size === 0) {
                return this._storage.get('avatar');
            }
            const avatarUrl = URL.createObjectURL(avatar);
            this._storage.get('userSettingsData').avatar = avatarUrl;
            return avatarUrl;
        }
        this._storage.get('userSettingsData').avatar = avatar;
        return new File([avatar], 'avatar');
    }
}

export default new SettingsStore();
