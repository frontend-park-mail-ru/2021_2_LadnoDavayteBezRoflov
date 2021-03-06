// Базовая страница
import BaseView from '../BaseView.js';

import {Urls} from '../../constants/constants.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router.js';

// Шаблон
import template from './LoginView.hbs';

/**
 * Класс, реализующий страницу с входа.
 */
export default class LoginView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        const context = new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        SettingsStore.addListener(this._onRefresh);

        this.formAuthorizationCallback = this.formAuthorization.bind(this);

        this._inputElements = {
            login: null,
            password: null,
        };
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this._setContext(new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));
        this.render();
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this._setContext(new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));

        if (!this._isActive) {
            return;
        }

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     */
    render() {
        /* Если пользователь авторизован, то перебросить его на /boards */
        if (this.context.get('isAuthorized')) {
            Router.go(Urls.Boards, true);
            return;
        }

        super.render();

        this.addEventListeners();

        this.registerInputElements();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        document.getElementById('auth').addEventListener('submit', this.formAuthorizationCallback);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('auth')?.removeEventListener('submit',
                                                             this.formAuthorizationCallback);
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        this._inputElements.login = document.getElementById('login');
        this._inputElements.password = document.getElementById('password');
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {object} event событие
     */
    formAuthorization(event) {
        event.preventDefault();

        const data = {
            login: this._inputElements.login.value,
            password: this._inputElements.password.value,
        };

        userActions.login(data.login, data.password);
    }
}
