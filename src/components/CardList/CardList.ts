// Базовый компонент
import BaseComponent from '../BaseComponent';
import CardComponent from '../Card/Card';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './CardList.hbs' or its corresp... Remove this comment to see the full error message
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
    constructor(context: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(context, template);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'CardLis... Remove this comment to see the full error message
        Object.values(this.context.cards).forEach((card) => {
            this.addComponentToList('_cards', new CardComponent(card));
        });
    }
}
