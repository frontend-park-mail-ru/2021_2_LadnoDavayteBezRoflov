// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Стор
import BoardStore from '../../stores/BoardStore/BoardStore.js';

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
     * @param {Element} parent - элемент, в который отрисуется данный popup
     */
    constructor(parent) {
        super(null, template, parent);
        this._bindCallBacks();
        BoardStore.addListener(this._onStoreRefresh);
        this._registerPopUpElements();
    }


    /**
     * Метод, вызываемый при обновлении стора.
     * @private
     */
    _onStoreRefresh() {
        this._setContext(BoardStore.getContext('cardlist-popup'));
        this._removeEventListeners();

        if (!this.context.visible) {
            return;
        }
        super.render();
        this._registerPopUpElements();
        this._addEventListeners();
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
    _addEventListeners() {
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
    _removeEventListeners() {
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
        this._onStoreRefresh = this._onStoreRefresh.bind(this);
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
