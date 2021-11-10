// Базовый компонент
import BaseComponent from '../BaseComponent.js';

// Шаблон
import template from './Card.hbs';

// Стили
import './Card.scss';

/**
 * Класс, реализующий компонент Card.
 */
export default class CardComponent extends BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context) {
        super(context, template);
    }
}
