// Базовый компонент
import BaseComponent from '../BaseComponent.js';
import CardComponent from '../Card/Card.js';

// Шаблон
import template from './CardList.hbs';

// Шаблон
import templatePopup from './CardListPopup.hbs';

// Стили
import './CardList.scss';
import './CardListPopup.scss';

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

    /**
     * Метод, добавляющий event listeners.
     */
    addEventListeners() {
        document.getElementById('addCardList')?.addEventListener('click', this._addCardList);
        document.getElementById('editCardList')?.addEventListener('click', this._editCardList);
        document.getElementById('removeCardList')?.addEventListener('click', this._deleteCardList);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        document.getElementById('addCardList')?.removeEventListener('click', this._addCardList);
        document.getElementById('editCardList')?.removeEventListener('click', this._editCardList);
        document.getElementById('removeCardList')?.removeEventListener('click', this._deleteCardList);
    }

    // TODO render popup
}
