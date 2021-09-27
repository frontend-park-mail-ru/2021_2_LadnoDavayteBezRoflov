'use strict';

// Базовая страница
import BasePage from '../basePage.js';

// Компоненты
import NavbarComponent from '../../components/navbar/navbar.js';
import FooterComponent from '../../components/footer/footer.js';

// utils
import userStatus from '../../utils/userStatus/userStatus.js';
import router from '../../utils/router/router.js';
import { urls } from '../../utils/constants.js';

// Скомпилированный шаблон Handlebars
import './boards.tmpl.js';

/**
  * Класс, реализующий страницу с досками.
  */
export default class BoardsPage extends BasePage {

  /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
  constructor(parent) {
    super(parent, Handlebars.templates['boards.hbs']);
  }

  /**
   * Метод, отрисовывающий страницу.
   */
  render(context) {

    /* Если пользователь не авторизован, то перебросить его на вход */
    if (!userStatus.getAuthorized()) {
      router.toUrl(urls.login);
      return;
    }

    /* Подготовить данные к отрисовке */
    const data = this.prepareBoards(context);

    /* Отрисовать страницу */
    super.render(data);

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
    // placeholder
  }

  /**
  * Метод, удаляющий обработчики событий для страницы.
  */
  removeEventListeners() {
    // placeholder
    // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
  }

  /**
  * Метод, подготоваливающий данные о досках к отрисовке.
  * @param {json} context полученное от бэкенда сообщение
  * @returns {json} готовые к отрисовке данные
  */
  prepareBoards(context) {
    let data = {
      teams: {

      }
    }
    data.teams = { ...data, ...context};
    return data;
  }
  
}
