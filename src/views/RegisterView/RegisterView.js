// ! Этот файл нужно будет отрефакторить после утверждения архитектуры

// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import actions from '../../actions/actions.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
import Validator from '../../modules/Validator/Validator.js';
import Router from '../../modules/Router/Router.js';

import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу регистрации.
  */
export default class RegisterView extends BaseView {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        const context = UserStore.getContext();

        super(context, Handlebars.templates['views/RegisterView/RegisterView'], parent);

        this._onRefresh = this._onRefresh.bind(this);

        UserStore.addListener(this._onRefresh);

        this.formRegistrationCallback = this.formRegistration.bind(this);
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     * @param {Object|null} urlData параметры, переданные командной строкой
     */
    _onShow(urlData) {
        this._urlParams = urlData;
        console.log('register am shown');
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {
        try {
            this.removeEventListeners();
        } catch (error) {

        }
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.context = UserStore.getContext();

        if (this.context.get('isAuthorized')) {
            Router.go(Urls.Boards);
            return;
        }

        this._setContext(this.context);
        this.render();

        /* if (result === HttpStatusCodes.Unauthorized) {
            validationLabels.loginLabel.innerHTML = 'Не получилось создать пользователя';
            validationBoxes.loginBox.hidden = false;
        } */
    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render(context) {
        super.render(context);
        this.addEventListeners();
    }

    /**
  * Метод, добавляющий обработчики событий для страницы.
  */
    addEventListeners() {
        document.getElementById('register').addEventListener('submit', this.formRegistrationCallback);
    }

    /**
  * Метод, удаляющий обработчики событий для страницы.
  */
    removeEventListeners() {
        document.getElementById('register').removeEventListener('submit', this.formRegistrationCallback);
    // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
    }

    /**
  * Метод, получающий boxes для валидации из документа.
  * @return {object} боксы для валидации
  */
    registerValidationBoxes() {
        return {
            loginBox: document.getElementById('login-validation-box'),
            emailBox: document.getElementById('email-validation-box'),
            passwordBox: document.getElementById('password-validation-box'),
            controlPasswordBox: document.getElementById('control-password-validation-box'),
        };
    }

    /**
  * Метод, получающий labels для валидации из документа.
  * @return {object} лейблы для валидации
  */
    registerValidationLabels() {
        return {
            loginLabel: document.getElementById('login-validation-message'),
            emailLabel: document.getElementById('email-validation-message'),
            passwordLabel: document.getElementById('password-validation-message'),
            controlPasswordLabel: document.getElementById('control-password-validation-message'),
        };
    }

    /**
  * Метод, скрывающий boxes валидации.
  * @param {object} validationBoxes боксы для валидации.
  */
    hideAllValidations(validationBoxes) {
        validationBoxes.loginBox.hidden = true;
        validationBoxes.emailBox.hidden = true;
        validationBoxes.passwordBox.hidden = true;
        validationBoxes.controlPasswordBox.hidden = true;
    }

    /**
   * Метод, осуществляющий валидацию данных из формы.
   * @param {object} data объект, содержащий данные из формы
   * @param {object} validationBoxes объект, содержащий набор валидационных текстовых блоков
   * @param {object} validationLabels объект, содержащий набор валидационных текстовых подписей
   * @return {boolean} статус валидации
   */
    validate(data, validationBoxes, validationLabels) {
        const validator = new Validator();

        const login = validator.validateLogin(data.login);
        const email = validator.validateEMail(data.email);
        const password = validator.validatePassword(data.password);

        if (!login.status || !password.status || !email.status ||
            data['confirm-password'] !== data.password) {
            /* Вывести вообщение, если найдена ошибка */
            if (login.message !== '') {
                validationLabels.loginLabel.innerHTML = login.message;
                validationBoxes.loginBox.hidden = false;
            }

            if (email.message !== '') {
                validationLabels.emailLabel.innerHTML = email.message;
                validationBoxes.emailBox.hidden = false;
            }

            if (password.message !== '') {
                validationLabels.passwordLabel.innerHTML = password.message;
                validationBoxes.passwordBox.hidden = false;
            }

            if (data['confirm-password'] !== data.password) {
                validationLabels.controlPasswordLabel.innerHTML = 'Пароли не совпадают';
                validationBoxes.controlPasswordBox.hidden = false;
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
    async formRegistration(event) {
        event.preventDefault();

        /* Получить элементы для отрисовки ошибок */
        const validationBoxes = this.registerValidationBoxes();
        const validationLabels = this.registerValidationLabels();

        this.hideAllValidations(validationBoxes);

        const formData = new FormData(event.target);

        const data = {};
        formData.forEach((value, key) => data[key] = value);

        /* Проверить логин и пароль и отрисовать ошибки на странице */
        if (!this.validate(data, validationBoxes, validationLabels)) {
            return;
        }

        // debugger;
        actions.register(data.login, data.email, data.password);
    }
}
