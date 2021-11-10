/**
 * Базовый класс для реализации компонента.
 */
export default class BaseComponent {
    /**
     * Конструирует компонент. Обязательный параметр - функция отрисовки основного шаблона.
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     * @param {Function} template функция отрисовки шаблона
     * @param {Element?} parent элемент, в который будет отрисован шаблон
     */
    constructor(context, template, parent) {
        if (!template) {
            throw new Error('Не задан шаблон компонента');
        }

        this.template = template;
        this.parent = parent;
        this.context = context;

        this.subComponents = new Map(); // Именованные компоненты
        this.subComponentsLists = new Map(); // Именованные списки однотипных компонентов
    }

    /**
     * Метод, обновляющий контекст у текущего компонента и его субкомпонентов
     * @param {Object} context
     */
    _setContext(context) {
        this.context = context;

        this.subComponents.forEach((component) => {
            component.context = this.context;
        });

        this.subComponentsLists.forEach((componentList) => {
            componentList.forEach((component) => {
                component.context = this.context;
            });
        });
    }

    /**
     * Метод, отрисовывающий HTML компонента.
     * @return {String} HTML-код компонента
     */
    render() {
        const components = [...this.subComponents.entries()].reduce((prev, [name, component]) => {
            return {...prev, [name]: component.render()};
        }, {});

        const componentsLists = [...this.subComponentsLists.entries()]
            .reduce((prev, [name, components]) => {
                const renderedComponents = components.map((component) => {
                    return component.render();
                });
                return {...prev, [name]: renderedComponents};
            }, {});

        const contextWithComponents = {
            ...components,
            ...componentsLists,
            ...(this.context instanceof Map ? Object.fromEntries(this.context.entries()) : this.context),
        };

        const mainHTML = this.template(contextWithComponents);

        if (!this.parent) {
            return mainHTML;
        }

        this.parent.innerHTML = mainHTML;
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
        this.subComponents.forEach((component) => {
            component.addEventListeners();
        });

        this.subComponentsLists.forEach((componentList) => {
            componentList.forEach((component) => {
                component.addEventListeners();
            });
        });
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        this.subComponents.forEach((component) => {
            component.removeEventListeners();
        });

        this.subComponentsLists.forEach((componentList) => {
            componentList.forEach((component) => {
                component.removeEventListeners();
            });
        });
    }

    /**
     * Сохраняет объект компонента под переданным именем
     * @param {String} name - имя компонента
     * @param {Object} component - объект компонента
     */
    addComponent(name, component) {
        this.subComponents.set(name, component);
    }

    /**
     * Сохраняет компонент в именованный список
     * @param {String} name - имя списка
     * @param {Object} component - объект компонента
     */
    addComponentToList(name, component) {
        if (!this.subComponentsLists.get(name)) {
            this.subComponentsLists.set(name, []);
        }
        this.subComponentsLists.get(name).push(component);
    }

    /**
     * Удаляет список из компонентов
     * @param {String} name
     */
    removeComponentsList(name) {
        this.subComponentsLists.delete(name);
    }
}
