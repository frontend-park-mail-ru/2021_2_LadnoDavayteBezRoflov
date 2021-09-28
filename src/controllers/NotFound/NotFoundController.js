'use strict';

// Интерфейс контроллера.
import ControllerInterface from '../BaseController.js';

// Скрипт ненайденной страницы.
import NotFoundPage from '../../pages/NotFoundPage.js';

/**
 * Класс, реализующий контроллер для страницы с ошибкой 404.
 */
export default class NotFoundController extends ControllerInterface {
  /**
   * Конструктор, создающий контроллер для страницы-404.
   */
  constructor() {
    super();
    this.view = new NotFoundPage();
  }

  /**
   * Метод, реализующий логику контроллера страницы-404.
   */
  work() {
    this.view.render();
  }
}
