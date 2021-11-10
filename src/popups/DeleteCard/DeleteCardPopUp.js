// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './DeleteCardPopUp.hbs';

// Actions
import {cardActions} from '../../actions/card.js';

/**
 * Класс popup'а удаления карточки
 */
export default class DeleteCardPopUp extends BaseComponent {
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
            wrapper: document.getElementById('deleteCardPopUpWrapperId'),
            closeBtn: document.getElementById('deleteCardPopUpCloseId'),
            confirmBtn: document.getElementById('deleteCardPopUpConfirmBtnId'),
            rejectBtn: document.getElementById('deleteCardPopUpRejectBtnId'),
        };
    }

    /**
     * Метод регистрирует callback'и
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.confirmBtn?.addEventListener('click', this._onConfirm);
        this._elements.rejectBtn?.addEventListener('click', this._onReject);
    };

    /**
     * Метод удаляет все ранее зарегистрированные callback'и
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        this._elements.confirmBtn?.removeEventListener('click', this._onConfirm);
        this._elements.rejectBtn?.removeEventListener('click', this._onReject);
    }

    /**
     * Метод биндит this контекст к callback-методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onConfirm = this._onConfirm.bind(this);
        this._onReject = this._onReject.bind(this);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            cardActions.hideDeleteCardPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить"
     * @param {Event} event объект события
     * @private
     */
    _onConfirm(event) {
        event.preventDefault();
        cardActions.deleteCard(true);
    }

    /**
     * Callback, вызываемый при нажатии "Не удалять"
     * @param {Event} event объект события
     * @private
     */
    _onReject(event) {
        event.preventDefault();
        cardActions.deleteCard(false);
    }
}
