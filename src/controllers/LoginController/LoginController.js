'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// Страница входа
import LoginPage from '../../pages/LoginPage/LoginPage.js';

/**
 * Класс, реализующий контроллер для страницы входа.
 */
export default class LoginController extends ControllerInterface {
    /**
     * Конструктор, создающий контроллер для страницы входа.
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        super();
        this.page = new LoginPage(parent);
    }

    /**
     * Метод, реализующий логику контроллера страницы входа. 
     */
    work(body) {
        return this.page.render(body);
    }
}
