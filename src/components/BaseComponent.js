/**
 * Базовый класс для реализации компонента.
 */
export default class BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     * @param {Object} mainTemplate объект с функцией шаблона и контейнером для него
     * @param {Function} mainTemplate.template функция отрисовки шаблона
     * @param {Element?} mainTemplate.parent элемент, в который будет отрисован шаблон
     * @param {Object} popupTemplate Объект с функцией шаблона popup и контейнером для него
     * @param {Function} popupTemplate.template функция отрисовки шаблона popup
     * @param {Element?} popupTemplate.parent элемент, в который будет отрисован шаблон popup
     */
    constructor(context, mainTemplate, popupTemplate) {
        if (!mainTemplate.template) {
            throw new Error('Не задан основной шаблон компонента');
        }

        this.mainTemplate = mainTemplate;
        this.popupTemplate = popupTemplate;
        this.context = context;
        this.subComponents = [];
    }

    /**
     * Метод, отрисовывающий HTML компонента.
     * @return {String} HTML-код компонента
     */
    render() {
        const components = this.subComponents.reduce(function(accumulator, object) {
            return {...accumulator, ...{[object[0]]: object[1].render()}};
        }, {});

        this.parent.innerHTML = this.template({...components, ...Object.fromEntries(this.context)});


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
        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        this.subComponents.forEach(([_, component]) => {
            component.removeEventListeners();
        });
    }
}
