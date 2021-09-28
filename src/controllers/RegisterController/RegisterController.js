'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// Страница регистрации
import RegisterPage from '../../pages/RegisterPage/RegisterPage.js';

/**
 * Класс, реализующий контроллер для страницы регистрации.
 */
export default class RegisterController extends ControllerInterface {
  /**
     * Конструктор, создающий контроллер для страницы регистрации.
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
  constructor(parent) {
    super();
    this.page = new RegisterPage(parent);
  }

  /**
     * Метод, реализующий логику контроллера страницы регистрации.
     */
  work(body) {
    return this.page.render(body);
  }
}
