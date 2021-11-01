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

// Стили
import './ProfileView.scss';

// Шаблон
import template from './ProfileView.hbs';

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
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        SettingsStore.addListener(this._onRefresh);

        this.formUpdateCallback = this.formUpdate.bind(this);
        this.onAvatarChange = this.onAvatarChange.bind(this);

        this._inputElements = {
            login: null,
            email: null,
            password: null,
            passwordRepeat: null,
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

        super.render();

        this.addEventListeners();
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
        settingsActions.putSettings(new FormData(document.getElementById('profile')));
    }

    /**
     * Обработчик: загрузка аватарки пользователя.
     * @param {object} event
     */
    onAvatarChange(event) {
        settingsActions.uploadAvatar(event.target.files[0]);
    }
}
