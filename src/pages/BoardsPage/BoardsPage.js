'use strict';

// Базовая страница
import BasePage from '../BasePage.js';

// Компоненты
import NavbarComponent from '../../components/Navbar/Navbar.js';
import FooterComponent from '../../components/Footer/Footer.js';

// utils
import userStatus from '../../utils/UserStatus/UserStatus.js';
import router from '../../utils/Router/Router.js';
import {Urls} from '../../utils/constants.js';

// Скомпилированный шаблон Handlebars
import './BoardsPage.tmpl.js';

/**
  * Класс, реализующий страницу с досками.
  */
export default class BoardsPage extends BasePage {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        super(parent, Handlebars.templates['BoardsPage.hbs']);
    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render(context) {
    /* Если пользователь не авторизован, то перебросить его на вход */
        if (!userStatus.getAuthorized()) {
            router.go(Urls.Login);
        }

        const data = this.prepareBoards(context);

        super.render(data);

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
  * @return {json} готовые к отрисовке данные
  */
    prepareBoards(context) {
        const data = {teams: {}};
        data.teams = {...context};
        return data;
    }
}
