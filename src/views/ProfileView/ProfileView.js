import BaseView from '../BaseView.js';

// Actions
import {settingsActions} from '../../actions/settings.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore.js';

// Modules
import Router from '../../modules/Router/Router.js';

// Constants
import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу профиля.
  */
export default class ProfileView extends BaseView {
    /**
    * @constructor
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        const context = new Map([...UserStore.getContext(), ...SettingsStore.getContext()]);
        super(context, Handlebars.templates['views/ProfileView/ProfileView'], parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        SettingsStore.addListener(this._onRefresh);

        this.formUpdateCallback = this.formUpdate.bind(this);
        this.onAvatarChange = this.onAvatarChange.bind(this);

        this._inputElements = {
            login: undefined,
            email: undefined,
            password: undefined,
            passwordRepeat: undefined,
            avatar: undefined,
        };
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this.render();
        settingsActions.getSettings(UserStore.getContext('userName'));
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([...UserStore.getContext(), ...SettingsStore.getContext()]));

        if (!this._isActive) {
            return;
        }

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     * @param {object} context контекст отрисовки страницы
     */
    render() {
        /* Если пользователь не авторизован, то перебросить его на страницу входа */
        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login);
            return;
        }

        if (this.context.get('userSettingsData') !== undefined &&
            !!this.context.get('userSettingsData').avatar) {
            this.context.set('avatar', this.context.get('userSettingsData').avatar);
        }

        super.render();

        this.addEventListeners();

        this._avatar = document.getElementById('avatar-img');
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        document.getElementById('profile')?.addEventListener('submit', this.formUpdateCallback);

        document.getElementById('avatar')?.addEventListener('change', this.onAvatarChange);

        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        document.getElementById('profile')?.removeEventListener('submit',
                                                                this.formUpdateCallback);
        document.getElementById('avatar')?.removeEventListener('change', this.onAvatarChange);
    }

    /**
     * Обработчик: отправка формы.
     * @param {object} event событие
     */
    formUpdate(event) {
        event.preventDefault();
        const data = new FormData(document.getElementById('profile'));
        settingsActions.putSettings(data);
    }

    /**
     * Обработчик: загрузка аватарки пользователя.
     * @param {object} event
     */
    onAvatarChange(event) {
        if (event.target.files[0].size > 500 * 1024) {
            document.getElementById('avatar-validation-box').hidden = false;
            document.getElementById('avatar-validation-message').innerHTML =
            'Размер аватарки превышает 500КиБ';
            return;
        }
        this._avatar.src = URL.createObjectURL(event.target.files[0]);
        document.getElementById('avatar-validation-box').hidden = true;
    }
}