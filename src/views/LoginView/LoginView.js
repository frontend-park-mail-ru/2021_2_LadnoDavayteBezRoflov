// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
import Validator from '../../modules/Validator/Validator.js';
import Router from '../../modules/Router/Router.js';

// Constants
import {Urls, HttpStatusCodes, ConstantMessages} from '../../constants/constants.js';

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

        this._validationElements = new Map();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     * @param {Object|null} urlData параметры, переданные командной строкой
     */
    _onShow(urlData) {
        this._urlParams = urlData;
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.context = UserStore.getContext();

        this._setContext(this.context);

        if (!this.__isOpened()) {
            return;
        }

        this.render();

        switch (this.context.get('status')) {
        case HttpStatusCodes.Unauthorized:
            this._validationElements.get('labels').login.innerHTML =
                ConstantMessages.WrongCredentials;
            this._validationElements.get('labels').password.innerHTML =
                ConstantMessages.WrongCredentials;
            this.__changeValidationVisibility(true);
            break;

        case HttpStatusCodes.InternalServerError:
            this._validationElements.get('labels').login.innerHTML =
                ConstantMessages.UnableToLogin;
            this._validationElements.get('boxes').login.hidden = false;
            break;

        default:
            return;
        }
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

        super.render(this.context);

        this.addEventListeners();

        this.registerValidationElements();
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
        if (document.getElementById('auth')) {
            document.getElementById('auth').removeEventListener('submit',
                                                                this.formAuthorizationCallback);
        }
    }

    /**
     * Метод, регистрирующий валидацию в документе.
     */
    registerValidationElements() {
        this._validationElements.set('boxes', {
            login: document.getElementById('login-validation-box'),
            password: document.getElementById('password-validation-box'),
        });

        this._validationElements.set('labels', {
            login: document.getElementById('login-validation-message'),
            password: document.getElementById('password-validation-message'),
        });
    }

    /**
     * Метод, меняющий статус областей валидации в документе.
     * @param {boolean} status статус отображения (true - отобразить, false - скрыть)
     */
    __changeValidationVisibility(status) {
        for (const value of Object.values(this._validationElements.get('boxes'))) {
            value.hidden = !status;
        }

        for (const value of Object.values(this._validationElements.get('labels'))) {
            value.hidden = !status;
        }
    }


    /**
     * Метод, осуществляющий валидацию данных из формы.
     * @param {object} data объект, содержащий данные из формы
     * @return {boolean} статус валидации
     */
    validate(data) {
        const validator = new Validator();

        const login = validator.validateLogin(data.login);
        const password = validator.validatePassword(data.password);

        if (!login.status || !password.status) {
            /* Вывести вообщение, если найдена ошибка */
            if (login.message !== '') {
                this._validationElements.get('labels').login.innerHTML = login.message;
                this._validationElements.get('labels').login.hidden = false;
                this._validationElements.get('boxes').login.hidden = false;
            }

            if (password.message !== '') {
                this._validationElements.get('labels').password.innerHTML = password.message;
                this._validationElements.get('labels').password.hidden = false;
                this._validationElements.get('boxes').password.hidden = false;
            }

            /* Предотвратить отправку запроса */
            return false;
        }

        return true;
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {form} event форма
     */
    async formAuthorization(event) {
        /* Запретить обновление страницы */
        event.preventDefault();

        /* Скрыть отображение ошибок */
        this.__changeValidationVisibility(false);

        /* Получить данные из формы */
        const formData = new FormData(event.target);

        /* Сохранить данные из формы в переменную */
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        /* Проверить логин, e-mail и пароли и отрисовать ошибки на странице */
        if (!this.validate(data)) {
            return;
        }

        /* Послать запрос на сервер */
        userActions.login(data.login, data.password);
    }
}
