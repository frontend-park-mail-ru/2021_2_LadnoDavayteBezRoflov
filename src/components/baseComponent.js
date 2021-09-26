'use strict';

/**
 * Базовый класс для реализации компонента.
 */
export default class BaseComponent {

    /**
    * Конструктор, создающий базовый класс реализации компонента.
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(parent, context) {
        this.parent = parent;
        this.context = context;
    }

    /**
    * Метод, отрисовывающий HTML компонента.
    */
    render() {
        /* Вставить HTML отрисованного partial непосредственно перед элементом parent */
        this.parent.insertAdjacentHTML('beforebegin', this.renderPartial());
    }
}
