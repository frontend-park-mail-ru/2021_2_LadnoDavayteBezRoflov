// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
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

        this._inputElements = new Map();
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
        this.registerInputElements();

        this._setValidation();
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
        this._validationElements.set('login', {
            box: document.getElementById('login-validation-box'),
            label: document.getElementById('login-validation-message'),
        });

        this._validationElements.set('password', {
            box: document.getElementById('password-validation-box'),
            label: document.getElementById('password-validation-message'),
        });
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        this._inputElements.set('login', document.getElementById('login'));
        this._inputElements.set('password', document.getElementById('password'));
    }

    /**
     * Метод, меняющий статус областей валидации в документе.
     * @param {boolean} status статус отображения (true - отобразить, false - скрыть)
     * @param {String | undefined} field поле, элементы которого нужно поменять (или все, если undefined)
     */
    __changeValidationVisibility(status, field) {
        if (field) {
            Object.values(this._validationElements.get(field)).forEach((element) => {
                element.hidden = !status;
            });

            return;
        }

        for (const value of this._validationElements.values()) {
            Object.values(value).forEach((element) => {
                element.hidden = !status;
            });
        }
    }

    /**
     * Метод, заполняющий элементы валидации и поля ввода информацией.
     */
    _setValidation() {
        for (const [key, value] of this.context.get('validation')) {
            if (!value) {
                break;
            }

            if (!this._validationElements.has(key)) {
                throw new Error('LoginView: не существует элементов для отображения валидации');
            }

            if (!value.status) {
                this._validationElements.get(key)['label'].innerHTML = value.message;
                this.__changeValidationVisibility(true, key);
                continue;
            }

            if (this.context.get('payload')) {
                this._inputElements.get(key).value = this.context.get('payload')[key];
            }
        }

        switch (this.context.get('status')) {
        case HttpStatusCodes.Unauthorized:
            this._validationElements.get('login')['label'].innerHTML =
                        ConstantMessages.WrongCredentials;
            this._validationElements.get('password')['label'].innerHTML =
                        ConstantMessages.WrongCredentials;

            this.__changeValidationVisibility(true);

            break;

        case HttpStatusCodes.InternalServerError:

            this._validationElements.get('login')['label'].innerHTML =
                        ConstantMessages.UnableToLogin;
            this.__changeValidationVisibility(true, 'login');
            break;

        default:
            return;
        }
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

        /* Послать запрос на сервер */
        userActions.login(data.login, data.password);
    }
}
