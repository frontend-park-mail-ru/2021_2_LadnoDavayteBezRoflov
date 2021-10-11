'use strict';

// Базовый компонент
import BaseComponent from '../BaseComponent.js';

/**
 * Класс, реализующий компонент Navbar.
 */
export default class NavbarComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Navbar.
    * @param {Element} parent HTML-элемент, в который
    * будет осуществлена отрисовка
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(parent, context) {
        super(parent, context);
        this.renderComponent = Handlebars.templates['components/Navbar/Navbar'];
    }

    /**
    * Метод, отрисовывающий компонент по заданному шаблону
    * renderComponent и контексту this.context.
    * @return {string} отрисованный код компонента
    */
    renderPartial() {
        return this.renderComponent(this.context);
    }
}
