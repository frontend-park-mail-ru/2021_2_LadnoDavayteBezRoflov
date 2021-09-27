'use strict';

// Базовая страница
import BasePage from '../basePage.js';

// Компоненты
import NavbarComponent from '../../components/navbar/navbar.js';
import FooterComponent from '../../components/footer/footer.js';

// utils
import network from '../../utils/network/network.js';
import userStatus from '../../utils/userStatus/userStatus.js';
import router from '../../utils/router/router.js';
import Validator from '../../utils/validator/validate.js';
import { urls } from '../../utils/constants.js';

// Скомпилированный шаблон Handlebars
import './login.tmpl.js';

/**
  * Класс, реализующий страницу с входа.
  */
export default class LoginPage extends BasePage {

  /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
  constructor(parent) {
    super(parent, Handlebars.templates['login.hbs']);
    this.formAuthorizationCallback = this.formAuthorization.bind(this);
  }

  /**
   * Метод, отрисовывающий страницу.
   */
  render(context) {

    /* Если пользователь авторизован, то перебросить его на страницу списка досок */
    if (userStatus.getAuthorized()) {
        router.toUrl(urls.boards);
        return;
    }

    /* Отрисовать страницу */
    super.render(context);

    /* Создание и отрисовка компонента Navbar */
    this.navbarComponent = new NavbarComponent(document.getElementById('header-main'), userStatus);
    this.navbarComponent.render();

    /* Создание и отрисовка компонента Footer */
    this.navbarComponent = new FooterComponent(document.getElementById('footer-main'), userStatus);
    this.navbarComponent.render();

    /* Добавление обработчиков событий */
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
  */
  registerValidationBoxes() {
    return {
      loginBox: document.getElementById('login-validation-box'),
      emailBox: document.getElementById('email-validation-box'),
      passwordBox: document.getElementById('password-validation-box'),
      controlPasswordBox: document.getElementById('control-password-validation-box'),
    }
  }

  /**
  * Метод, получающий labels для валидации из документа.
  */
  registerValidationLabels() {
    return {
      loginLabel: document.getElementById('login-validation-message'),
      passwordLabel: document.getElementById('password-validation-message'),
    }
  }

  /**
   * Метод, переводящий все валидационные дивы в нужный статус.
   * @param {object} validationBoxes объект с валидационными дивами
   * @param {*} status статус, в который будут переведены дивы
   */
  changeAllValidationBoxes(validationBoxes, status) {
    validationBoxes.loginBox.hidden = status;
    validationBoxes.passwordBox.hidden = status;
  }

  /**
  * Метод, обрабатывающий посылку формы.
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

    /* Создать валидатор */
    const validator = new Validator();

    /* Проверить логин и пароль */
    const login = validator.validateLogin(data['login']);
    const password = validator.validatePassword(data['password']);

    if (!login['status'] || !password['status']) {
      /* Вывести вообщение, если найдена ошибка */
      if (login['message'] !== '') {
        
        validationLabels.loginLabel.innerHTML = login['message'];
        validationBoxes.loginBox.hidden = false;
      }

      if (password['message'] !== '') {

        validationLabels.passwordLabel.innerHTML = password['message'];
        validationBoxes.passwordBox.hidden = false;
      }
      /* Предотвратить отправку запроса */
      return;
    }

    /* Послать запрос на сервер */
    const result = await network.sendAuthorization(data);

    /* Установить новое состояние клиента и перенаправить */
    if (result[0] === 200) {
        userStatus.setAuthorized(true);
        userStatus.setUserName(data['login']);
        router.toUrl(urls.boards);
        return;
    }

    /* Вывести ошибку */
    if (result[0] === 401) {
      validationLabels.loginLabel.innerHTML = 'Неверный логин или пароль';
      validationLabels.passwordLabel.innerHTML = 'Неверный логин или пароль';

      this.changeAllValidationBoxes(validationBoxes, false);
    }
  }
}
