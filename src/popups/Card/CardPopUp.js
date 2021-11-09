// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CardPopUp.hbs';

// Actions
import {cardActions} from '../../actions/card.js';

/**
 * Класс popup окна создания и редактирования карточки
 */
export default class CardPopUp extends BaseComponent {
    /**
     * @constructor
     */
    constructor() {
        super(null, template);
        this._bindCallBacks();
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        this._elements = {
            wrapper: document.getElementById('cardPopUpWrapperId'),
            closeBtn: document.getElementById('cardPopUpCloseId'),
            createBtn: document.getElementById('cardPopUpCreateBtnId'),
            saveBtn: document.getElementById('cardPopUpSaveBtnId'),
            positionSelect: document.getElementById('cardPopUpPositionId'),
            card_name: document.getElementById('cardPopUpTitleId'),
            description: document.getElementById('cardPopUpDescriptionId'),
            // deadline: document.getElementById('cardPopUpDeadlineId'),
        };
    }

    /**
     * Метод регистрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.createBtn?.addEventListener('click', this._onCreate);
        this._elements.saveBtn?.addEventListener('click', this._onSave);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        this._elements.createBtn?.removeEventListener('click', this._onCreate);
        this._elements.saveBtn?.removeEventListener('click', this._onSave);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onCreate = this._onCreate.bind(this);
        this._onSave = this._onSave.bind(this);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            cardActions.hidePopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event) {
        event.preventDefault();
        cardActions.updateCard(
            parseInt(this._elements.positionSelect.value, 10),
            this._elements.card_name.value,
            this._elements.description.value,
            // this._elements.deadline.value,
            this.context.cid,
            this.context.bid,
            this.context.clid,
        );
    }

    /**
     * Callback, вызываемый при нажатии "Создать"
     * @param {Event} event объект события
     * @private
     */
    _onCreate(event) {
        event.preventDefault();
        cardActions.createCard(
            this._elements.card_name.value,
            this._elements.description.value,
            // this._elements.deadline.value,
        );
    }
}
