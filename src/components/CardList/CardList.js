// Базовый компонент
import BaseComponent from '../BaseComponent.js';
import CardComponent from '../Card/Card.js';

/**
 * Класс, реализующий компонент CardList.
 */
export default class CardListComponent extends BaseComponent {
    /**
    * @constructor
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, Handlebars.templates['components/CardList/CardList']);
    }

    render() {
        const cards = [];

        Object.values(this.context.cards).forEach((card) => {
            cards.push(new CardComponent(card).render());
        });

        this.context._cards = cards;
        return this.template(this.context);
    }
}
