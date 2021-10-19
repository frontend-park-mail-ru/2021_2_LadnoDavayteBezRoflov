'use strict';

/**
 * Базовый класс для реализации компонента.
 */
export default class BaseComponent {
    /**
    * @constructor
    * @param {Object} context контекст отрисовки шаблона
    * @param {Function} template функция отрисовки шаблона
    * @param {Element | undefined} parent элемент, в который будет отрисован компонент
    */
    constructor(context, template, parent = undefined) {
        this.parent = parent;
        this.template = template;
        this.context = context;
    }

    /**
    * Метод, отрисовывающий HTML компонента.
    * @return {String} HTML-код компонента
    */
    render() {
        if (this.template !== null) {
            let html;
            if (typeof this.template === Function) {
                html = this.template(this.context);
            } else {
                html = this.template({...this.context});
            }

            if (this.parent === undefined) {
                return html;
            }
            this.parent.innerHTML = html;
        }
    }
}
