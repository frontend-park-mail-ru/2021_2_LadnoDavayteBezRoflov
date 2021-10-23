// Базовый компонент
import BaseComponent from '../BaseComponent.js';

/**
 * Класс, реализующий компонент Footer.
 */
export default class FooterComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Footer.
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, Handlebars.templates['components/Footer/Footer']);
    }

    /**
    * Метод, отрисовывающий компонент по заданному шаблону
    * @return {String} отрисованный код компонента
    */
    render() {
        return super.render();
    }
}
