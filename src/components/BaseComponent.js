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
    constructor(context, template, parent) {
        this.parent = parent;
        this.template = template;
        this.context = context;
    }

    /**
    * Метод, отрисовывающий HTML компонента.
    * @return {String} HTML-код компонента
    */
    render() {
        if (!!this.template) {
            if (this.context instanceof Map) {
                this.context = Object.fromEntries(this.context);
            }

            const html = (typeof this.template === Function) ?
                this.template(this.context) :
                this.template({...this.context});

            if (this.parent === undefined) {
                return html;
            }
            this.parent.innerHTML = html;
        }
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
    }
}
