// Базовый компонент
import BaseComponent from '../BaseComponent.js';
import CardComponent from '../Card/Card.js';

// Шаблон
import template from './CardList.hbs';

// Шаблон
import templatePopup from './CardListPopup.hbs';

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

        this._popupTemplate = templatePopup;

        this._inputElements = {
            title: null,
        };

        Object.values(this.context.cards).forEach((card) => {
            this.addComponentToList('_cards', new CardComponent(card));
        });
    }

    /**
     * Метод, добавляющий event listeners.
     */
    addEventListeners() {
        super.addEventListeners();
        document.getElementById('addCardList')?.addEventListener('click', this._addCardList);
        document.getElementById('editCardList')?.addEventListener('click', this._editCardList);
        document.getElementById('removeCardList')?.addEventListener('click', this._deleteCardList);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('addCardList')?.removeEventListener('click', this._addCardList);
        document.getElementById('editCardList')?.removeEventListener('click', this._editCardList);
        document.getElementById('removeCardList')?.removeEventListener('click', this._deleteCardList);
    }

    // TODO render popup
}
