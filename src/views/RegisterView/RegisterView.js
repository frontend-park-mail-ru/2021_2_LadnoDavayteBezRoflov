// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
import Router from '../../modules/Router/Router.js';

import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу регистрации.
  */
export default class RegisterView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        const context = UserStore.getContext();

        super(context, Handlebars.templates['views/RegisterView/RegisterView'], parent);

        this._onRefresh = this._onRefresh.bind(this);

        UserStore.addListener(this._onRefresh);

        this.formRegistrationCallback = this.formRegistration.bind(this);

        this._inputElements = {
            login: undefined,
            email: undefined,
            password: undefined,
            passwordRepeat: undefined,
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
        this._setContext(UserStore.getContext());

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
        /* Если пользователь авторизован, то перебросить его на страницу списка досок */
        if (this.context.get('isAuthorized')) {
            Router.go(Urls.Boards);
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
        document.getElementById('register').addEventListener('submit', this.formRegistrationCallback);

        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        document.getElementById('register')?.removeEventListener('register',
                                                                 this.formAuthorizationCallback);
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
     * @param {form} event форма
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
