import BaseStore from '../BaseStore.js';

// Actions
import {SettingsActionTypes} from '../../actions/settings.js';
import {userActions} from '../../actions/user.js';

// Modules
import Network from '../../modules/Network/Network.js';
import Validator from '../../modules/Validator/Validator.js';

// Constants
import {
    ConstantMessages,
    HttpStatusCodes,
    SettingStoreConstants,
    Urls,
} from '../../constants/constants.js';
import {serviceWorkerActions, ServiceWorkerTypes} from '../../actions/serviceworker';
import Router from '../../modules/Router/Router';

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

        this._storage.set('uid', null);
        this._storage.set('login', null);
        this._storage.set('email', null);
        this._storage.set('password', null);
        this._storage.set('passwordRepeat', null);
        this._storage.set('avatar', '/assets/nodata.webp');
        this._storage.set('navbar', {
            linksVisible: window.innerWidth > SettingStoreConstants.MobileNavWidth,
            prevWidth: window.innerWidth,
            isMobile: window.innerWidth < SettingStoreConstants.MobileNavWidth,
        });
        this._storage.set('offline', {
            half: false,
            full: false,
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

        case SettingsActionTypes.NAVBAR_MENU_BTN_CLICK:
            this._toggleNavbarMenu();
            this._emitChange();
            break;

        case SettingsActionTypes.WINDOW_RESIZED:
            this._windowResized(action.data);
            break;

        case ServiceWorkerTypes.HALF_OFFLINE:
            this._responseFromCache();
            this._emitChange();
            break;

        case ServiceWorkerTypes.FULL_OFFLINE:
            this._fullOffline();
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
        if (!data.userName) {
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
            this._storage.set('uid', payload.data.uid);
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

        this._storage.set('login', data.login);
        this._storage.set('email', data.email);
        this._storage.get('validation').password = null;
        this._storage.get('validation').passwordRepeat = null;
        formdata.avatar = this._storage.get('avatar');

        this._validate(data);

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
            this._storage.set('avatar', payload.data.avatar);
            this._emitChange();
            return;

        case HttpStatusCodes.NotModified:
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
            if (!data.avatar.size) {
                throw new Error('SettingsStore: Ошибка загрузки аватара');
            }

            this._storage.get('validation').avatar = validator.validateAvatar(data.avatar);
            if (this._storage.get('validation').avatar) {
                this._storage.set('avatar', null);
                return;
            }
        }

        this._storage.set('avatar', this.__setAvatar(data.avatar));

        const formdata = new FormData();

        formdata.append('avatar', data.avatar);

        let payload;

        try {
            payload = await Network.putImage(formdata, this._storage.get('login'));
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('avatar', payload.data.avatar);
            this._emitChange();
            return;

        case HttpStatusCodes.BadRequest:
            this._storage.get('validation').avatar = ConstantMessages.BadRequest;
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
     * @param {FormData} data FormData, содержащая данные из формы
     */
    _validate(data) {
        const validator = new Validator();

        const validation = this._storage.get('validation');

        validation.login = validator.validateLogin(data.login);
        if (validation.login) {
            this._storage.set('login', '');
        }

        validation.oldPassword = validator.validatePassword(data.old_password);

        if (data.password) {
            validation.password = validator.validatePassword(data.password);
        }

        validation.email = validator.validateEMail(data.email);
        if (validation.email) {
            this._storage.set('email', '');
        }

        if (data.password) {
            if (data.password !== data.passwordRepeat) {
                validation.passwordRepeat = ConstantMessages.NonMatchingPasswords;
            }
        }

        validation.avatar = validator.validateAvatar(data.avatar);
        if (validation.avatar) {
            this._storage.set('avatar', '');
        }
    }

    /**
     * Метод, проверяющий, корректны ли все данные (пройдена ли валидация).
     * @return {boolean} статус валидации
     */
    __validationPassed() {
        return Object.values(this._storage.get('validation')).every((element) => {
            return !element;
        });
    }

    /**
     * Метод, проверяющий тип аватара:
     * File при загрузке или String на блоб, если файл уже был загружен
     * @param {String|File} avatar
     * @return {File|String|null} файл или адрес blob
     */
    __setAvatar(avatar) {
        if (avatar instanceof File) {
            if (!avatar.size) {
                return null;
            }
            const avatarUrl = URL.createObjectURL(avatar);
            return avatarUrl;
        }
        return new File([avatar], 'avatar');
    }

    /**
     * Метод переключает видимсоть ссылок в navbar
     * @private
     */
    _toggleNavbarMenu() {
        const navbar = this._storage.get('navbar');
        navbar.linksVisible = !navbar.linksVisible;
    }

    /**
     * Метод вызывается при изменении размера окна
     * @param {Object} data - объект с новой геометрией окна
     * @private
     */
    _windowResized(data) {
        const context = this._storage.get('navbar');
        const prevWidth = context.prevWidth;
        context.prevWidth = data.width;

        /* Если вышли за границы мобильной версии: */
        if (prevWidth <= SettingStoreConstants.MobileNavWidth &&
            data.width > SettingStoreConstants.MobileNavWidth) {
            context.linksVisible = true;
            context.isMobile = false;
            this._emitChange();
            return;
        }

        /* Если вошли в границы мобильной версии: */
        if (prevWidth >= SettingStoreConstants.MobileNavWidth &&
            data.width < SettingStoreConstants.MobileNavWidth) {
            context.linksVisible = false;
            context.isMobile = true;
            this._emitChange();
        }
    }

    /**
     * Отображает предупреждение об offline работе
     */
    _responseFromCache() {
        console.log('offline half');
        this._storage.get('offline').half = true;
    }

    /**
     * Отображает offline страницу
     */
    _fullOffline() {
        console.log('offline full');
        Router.go(Urls.Offline, true);
    }
}

export default new SettingsStore();
