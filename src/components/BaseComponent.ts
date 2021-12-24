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
    constructor(context: any, template: any, parent: any) {
        if (!template) {
            throw new Error('Не задан шаблон компонента');
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'template' does not exist on type 'BaseCo... Remove this comment to see the full error message
        this.template = template;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'parent' does not exist on type 'BaseComp... Remove this comment to see the full error message
        this.parent = parent;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BaseCom... Remove this comment to see the full error message
        this.context = context;

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents = new Map(); // Именованные компоненты
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists = new Map(); // Именованные списки однотипных компонентов
    }

    /**
     * Метод, обновляющий контекст у текущего компонента и его субкомпонентов
     * @param {Object} context
     */
    _setContext(context: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BaseCom... Remove this comment to see the full error message
        this.context = context;

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents.forEach((component: any) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BaseCom... Remove this comment to see the full error message
            component.context = this.context;
        });

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists.forEach((componentList: any) => {
            componentList.forEach((component: any) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BaseCom... Remove this comment to see the full error message
                component.context = this.context;
            });
        });
    }

    /**
     * Метод, обновляет контекст у компонента с заданным именем.
     * @param {String} componentName - название компонента
     * @param {Object} context - новый контекст
     */
    _setContextByComponentName(componentName: any, context: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents.get(componentName)._setContext(context);
    }

    /**
     * Метод, отрисовывающий HTML компонента.
     * @return {String} HTML-код компонента
     */
    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        const components = [...this.subComponents.entries()].reduce((prev, [name, component]) => {
            return {...prev, [name]: component.render()};
        }, {});

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        const componentsLists = [...this.subComponentsLists.entries()]
            .reduce((prev, [name, components]) => {
                const renderedComponents = components.map((component: any) => {
                    return component.render();
                });
                return {...prev, [name]: renderedComponents};
            }, {});

        const contextWithComponents = {
            ...components,
            ...componentsLists,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BaseCom... Remove this comment to see the full error message
            ...(this.context instanceof Map ? Object.fromEntries(this.context.entries()) : this.context),
        };

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'template' does not exist on type 'BaseCo... Remove this comment to see the full error message
        const mainHTML = this.template(contextWithComponents);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'parent' does not exist on type 'BaseComp... Remove this comment to see the full error message
        if (!this.parent) {
            return mainHTML;
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'parent' does not exist on type 'BaseComp... Remove this comment to see the full error message
        this.parent.innerHTML = mainHTML;
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents.forEach((component: any) => {
            component.addEventListeners();
        });

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists.forEach((componentList: any) => {
            componentList.forEach((component: any) => {
                component.addEventListeners();
            });
        });
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents.forEach((component: any) => {
            component.removeEventListeners();
        });

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists.forEach((componentList: any) => {
            componentList.forEach((component: any) => {
                component.removeEventListeners();
            });
        });
    }

    /**
     * Сохраняет объект компонента под переданным именем
     * @param {String} name - имя компонента
     * @param {Object} component - объект компонента
     */
    addComponent(name: any, component: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponents' does not exist on type 'B... Remove this comment to see the full error message
        this.subComponents.set(name, component);
    }

    /**
     * Сохраняет компонент в именованный список
     * @param {String} name - имя списка
     * @param {Object} component - объект компонента
     */
    addComponentToList(name: any, component: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        if (!this.subComponentsLists.get(name)) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
            this.subComponentsLists.set(name, []);
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists.get(name).push(component);
    }

    /**
     * Удаляет список из компонентов
     * @param {String} name
     */
    removeComponentsList(name: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'subComponentsLists' does not exist on ty... Remove this comment to see the full error message
        this.subComponentsLists.delete(name);
    }
}
