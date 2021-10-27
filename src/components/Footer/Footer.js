// Базовый компонент
import BaseComponent from '../BaseComponent.js';

/**
 * Класс, реализующий компонент Footer.
 */
export default class FooterComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Footer.
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, Handlebars.templates['components/Footer/Footer']);
    }
}
