'use strict';

// Базовая страница
import BasePage from '../BasePage.js';

// Компоненты
import NavbarComponent from '../../components/Navbar/Navbar.js';
import FooterComponent from '../../components/Footer/Footer.js';

// utils
import network from '../../utils/Network/Network.js';
import userStatus from '../../utils/UserStatus/UserStatus.js';
import router from '../../utils/Router/Router.js';
import Validator from '../../utils/Validator/Validator.js';
import {HttpStatusCodes, Urls} from '../../utils/constants.js';

// Скомпилированный шаблон Handlebars
import './RegisterPage.tmpl.js';

/**
  * Класс, реализующий страницу регистрации.
  */
export default class RegisterPage extends BasePage {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        super(parent, Handlebars.templates['RegisterPage.hbs']);
        this.formRegistrationCallback = this.formRegistration.bind(this);
    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render(context) {
    /* Если пользователь авторизован, то перебросить его на страницу списка досок */
        if (userStatus.getAuthorized()) {
            router.toUrl(Urls.Boards);
            return;
        }

        super.render(context);

        /* Создание и отрисовка компонента Navbar */
        this.navbarComponent = new NavbarComponent(document.getElementById('header-main'), userStatus);
        this.navbarComponent.render();

        /* Создание и отрисовка компонента Footer */
        this.navbarComponent = new FooterComponent(document.getElementById('footer-main'), userStatus);
        this.navbarComponent.render();

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

        const [result] = await network.sendRegistration(data);

        if (result === HttpStatusCodes.Created) {
            userStatus.setAuthorized(true);
            userStatus.setUserName(data.login);
            this.removeEventListeners();
            router.toUrl(Urls.Boards);
            return;
        }

        if (result === HttpStatusCodes.Unauthorized) {
            validationLabels.loginLabel.innerHTML = 'Не получилось создать пользователя';
            validationBoxes.loginBox.hidden = false;
        }
    }
}
