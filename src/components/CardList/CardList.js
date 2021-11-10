// Базовый компонент
import BaseComponent from '../BaseComponent.js';
import CardComponent from '../Card/Card.js';

// Шаблон
import template from './CardList.hbs';

// Стили
import './CardList.scss';

/**
 * Класс, реализующий компонент CardList.
 */
export default class CardListComponent extends BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context) {
        super(context, template);

        Object.values(this.context.cards).forEach((card) => {
            this.addComponentToList('_cards', new CardComponent(card));
        });
    }
}
