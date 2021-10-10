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

/**
  * Класс, реализующий страницу с входа.
  */
export default class LoginPage extends BasePage {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        super(parent, Handlebars.templates['pages/LoginPage/LoginPage']);
        this.formAuthorizationCallback = this.formAuthorization.bind(this);
    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render(context) {
    /* Если пользователь авторизован, то перебросить его на страницу списка досок */
        if (userStatus.getAuthorized()) {
            router.go(Urls.Boards);
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
        document.getElementById('auth').addEventListener('submit', this.formAuthorizationCallback);
    }

    /**
  * Метод, удаляющий обработчики событий для страницы.
  */
    removeEventListeners() {
        document.getElementById('auth').removeEventListener('submit');
        // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
    }

    /**
  * Метод, получающий boxes для валидации из документа.
  * @return {object} боксы для валидации
  */
    registerValidationBoxes() {
        return {
            loginBox: document.getElementById('login-validation-box'),
            passwordBox: document.getElementById('password-validation-box'),
        };
    }

    /**
  * Метод, получающий labels для валидации из документа.
  * @return {object} лейблы для валидации
  */
    registerValidationLabels() {
        return {
            loginLabel: document.getElementById('login-validation-message'),
            passwordLabel: document.getElementById('password-validation-message'),
        };
    }

    /**
   * Метод, переводящий все валидационные дивы в нужный статус.
   * @param {object} validationBoxes объект с валидационными дивами
   * @param {boolean} status статус, в который будут переведены дивы
   */
    changeAllValidationBoxes(validationBoxes, status) {
        validationBoxes.loginBox.hidden = status;
        validationBoxes.passwordBox.hidden = status;
    }

    /**
   * Метод, осуществляющий валидацию данных из формы.
   * @param {object} data объект, содержащий данные из формы
   * @param {object} validationBoxes объект, содержащий набор валидационных текстовых блоков
   * @param {object} validationLabels объект, содержащий набор валидационных текстовых подписей
   * @return {boolean} статус валидации
   */
    validate(data, validationBoxes, validationLabels) {
        const validator = new Validator();

        const login = validator.validateLogin(data.login);
        const password = validator.validatePassword(data.password);

        if (!login.status || !password.status) {
            /* Вывести вообщение, если найдена ошибка */
            if (login.message !== '') {
                validationLabels.loginLabel.innerHTML = login.message;
                validationBoxes.loginBox.hidden = false;
            }

            if (password.message !== '') {
                validationLabels.passwordLabel.innerHTML = password.message;
                validationBoxes.passwordBox.hidden = false;
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

        /* Получить элементы для отрисовки ошибок */
        const validationBoxes = this.registerValidationBoxes();
        const validationLabels = this.registerValidationLabels();

        /* Скрыть отображение ошибок */
        this.changeAllValidationBoxes(validationBoxes, true);

        /* Получить данные из формы */
        const formData = new FormData(event.target);

        /* Сохранить данные из формы в переменную */
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        /* Проверить логин, e-mail и пароли и отрисовать ошибки на странице */
        if (!this.validate(data, validationBoxes, validationLabels)) {
            return;
        }

        /* Послать запрос на сервер */
        const [result] = await network.sendAuthorization(data);

        /* Установить новое состояние клиента и перенаправить */
        if (result === HttpStatusCodes.Ok) {
            userStatus.setAuthorized(true);
            userStatus.setUserName(data.login);
            router.go(Urls.Boards);
            return;
        }

        /* Вывести ошибку */
        if (result === HttpStatusCodes.Unauthorized) {
            validationLabels.loginLabel.innerHTML = 'Неверный логин или пароль';
            validationLabels.passwordLabel.innerHTML = 'Неверный логин или пароль';

            this.changeAllValidationBoxes(validationBoxes, false);
        }
    }
}
