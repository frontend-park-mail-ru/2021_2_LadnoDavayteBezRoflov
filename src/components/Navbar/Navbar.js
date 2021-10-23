// Базовый компонент
import BaseComponent from '../BaseComponent.js';

/**
 * Класс, реализующий компонент Navbar.
 */
export default class NavbarComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Navbar.
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, Handlebars.templates['components/Navbar/Navbar']);
    }

    /**
    * Метод, отрисовывающий компонент по заданному шаблону
    * @return {String} отрисованный код компонента
    */
    render() {
        return super.render();
    }
}
