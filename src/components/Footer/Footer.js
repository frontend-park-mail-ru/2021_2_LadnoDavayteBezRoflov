'use strict';

// Базовый компонент
import BaseComponent from '../BaseComponent.js';

// Скомпилированный шаблон Handlebars
import '/src/tmpl.js';

/**
 * Класс, реализующий компонент Footer.
 */
export default class FooterComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Footer.
    * @param {Element} parent HTML-элемент, в который будет
    * осуществлена отрисовка
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(parent, context) {
        super(parent, context);
        this.renderComponent = Handlebars.templates['components/Footer/Footer'];
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
