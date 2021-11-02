// Базовый компонент
import BaseComponent from '../BaseComponent.js';
import CardComponent from '../Card/Card.js';

// Шаблон
import template from './CardList.hbs';

// Шаблон
import templatePopup from './CardListPopup.hbs';

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

        this._popupTemplate = templatePopup;

        this._inputElements = {
            title: undefined,
        };
    }

    /**
     * Метод, отрисовывающий HTML компонента.
     * @return {String} HTML-код компонента
    */
    render() {
        const cards = [];

        Object.values(this.context.cards).forEach((card) => {
            cards.push(new CardComponent(card).render());
        });

        this.context._cards = cards;
        return this.template(this.context);
    }
}
