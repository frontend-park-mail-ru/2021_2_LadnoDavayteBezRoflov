// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router.js';

import {Urls} from '../../constants/constants.js';

// Стили
import './RegisterView.scss';

// Шаблон
import template from './RegisterView.hbs';

/**
  * Класс, реализующий страницу регистрации.
  */
export default class RegisterView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        const context = new Map([
            ...UserStore.getContext(),
            ...SettingsStore.getContext(),
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);

        UserStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);

        this.formRegistrationCallback = this.formRegistration.bind(this);

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
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([
            ...UserStore.getContext(),
            ...SettingsStore.getContext(),
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
        /* Если пользователь авторизован, то перебросить его на страницу списка досок */
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
        document.getElementById('register').addEventListener('submit', this.formRegistrationCallback);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('register')?.removeEventListener('submit',
                                                                 this.formRegistrationCallback);
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        this._inputElements.login = document.getElementById('login');
        this._inputElements.email = document.getElementById('email');
        this._inputElements.password = document.getElementById('password');
        this._inputElements.passwordRepeat = document.getElementById('passwordRepeat');
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {object} event событие
     */
    formRegistration(event) {
        event.preventDefault();

        const data = {
            login: this._inputElements.login.value,
            email: this._inputElements.email.value,
            password: this._inputElements.password.value,
            passwordRepeat: this._inputElements.passwordRepeat.value,
        };

        userActions.register(data.login, data.email, data.password, data.passwordRepeat);
    }
}
