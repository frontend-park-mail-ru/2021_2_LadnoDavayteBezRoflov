'use strict';

/**
 * Базовый класс для реализации страницы.
 */
export default class BasePage {
    /**
     * Конструктор, создающий базовый класс реализации страницы.
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     * @param {function} template шаблон для отрисовки
     */
    constructor(parent, template) {
        this.parent = parent;
        this.template = template;
    }

    /**
     * Метод, отрисовывающий страницу.
     * @param {any} data контекст данных для страницы
     */
    render(data) {
        this.parent.innerHTML = this.template(data);
    }
}
