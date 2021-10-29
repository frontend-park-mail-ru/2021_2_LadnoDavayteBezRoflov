// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
import Router from '../../modules/Router/Router.js';

// Constants
import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу с входа.
  */
export default class LoginView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        const context = UserStore.getContext();
        super(context, Handlebars.templates['views/LoginView/LoginView'], parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field

        this.formAuthorizationCallback = this.formAuthorization.bind(this);

        this._inputElements = {
            login: undefined,
            password: undefined,
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
        document.getElementById('auth').addEventListener('submit', this.formAuthorizationCallback);

        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
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