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

        //this._cards = [];

        //Object.values(this.context.cards).forEach((card) => {
        //    this._cards.push(new CardComponent(card).render());
        //});

        //this.context._cards = this._cards;
    }

    render() {
        const items = [];

        console.log(this.context)

        Object.values(this.context.cards).forEach((item) => {
            console.log(item)
            items.push(new CardComponent(item).render());
        });

        this.context._cards = items;
        return this.template(this.context);
    }
}
