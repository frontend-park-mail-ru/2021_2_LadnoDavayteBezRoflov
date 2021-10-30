// Базовый компонент
import BaseComponent from '../BaseComponent.js';
// Стили
import '../../../public/scss/Footer.scss';
// Шаблон
import template from './Footer.hbs';

/**
 * Класс, реализующий компонент Footer.
 */
export default class FooterComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Footer.
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, template);
    }
}
