// ! Этот файл нужно будет отрефакторить после утверждения архитектуры

// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';

// Modules
import Validator from '../../modules/Validator/Validator.js';
import Router from '../../modules/Router/Router.js';

import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу с входа.
  */
export default class LoginView extends BaseView {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        const context = UserStore.getContext();
        super(context, Handlebars.templates['views/LoginView/LoginView'], parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field

        this.formAuthorizationCallback = this.formAuthorization.bind(this);
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
    render() {
    /* Если пользователь авторизован, то перебросить его на страницу списка досок */
        if (this.context.get('isAuthorized')) {
            Router.go(Urls.Boards);
            return;
        }

        super.render(this.context);

        this.addEventListeners();
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
        userActions.login(data.login, data.password);

        /*         if (result === HttpStatusCodes.Unauthorized) {
            validationLabels.loginLabel.innerHTML = 'Неверный логин или пароль';
            validationLabels.passwordLabel.innerHTML = 'Неверный логин или пароль';

            this.changeAllValidationBoxes(validationBoxes, false);
        } */
    }
}
