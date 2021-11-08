// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CardListPopUp.hbs';

// Actions
import {cardListActions} from '../../actions/cardlist.js';


/**
 * Класс popup окна создания и редактирования списка карточек
 */
export default class CardListPopUp extends BaseComponent {
    /**
     * Конструирует объект CardListPopUp
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
            wrapper: document.getElementById('cardListPopUpWrapperId'),
            closeBtn: document.getElementById('cardListPopUpCloseId'),
            createBtn: document.getElementById('cardListPopUpCreateBtnId'),
            saveBtn: document.getElementById('cardListPopUpSaveBtnId'),
            positionSelect: document.getElementById('cardListPopUpPositionId'),
            title: document.getElementById('cardListPopUpTitleId'),
        };
    }

    /**
     * Метод регестрирует callback
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
            cardListActions.hideCardListPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event) {
        event.preventDefault();
        cardListActions.updateCardList(
            parseInt(this._elements.positionSelect.value, 10),
            this._elements.title.value,
        );
    }

    /**
     * Callback, вызываемый при нажатии "Создать"
     * @param {Event} event объект события
     * @private
     */
    _onCreate(event) {
        event.preventDefault();
        cardListActions.createCardList(
            this._elements.title.value,
        );
    }
}
