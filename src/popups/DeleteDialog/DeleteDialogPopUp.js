// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './DeleteDialogPopUp.hbs';

/**
 * Класс popup'а удаления списка карточек
 */
export default class DeleteCardListPopUp extends BaseComponent {
    /**
     * Конструирует объект DeleteCardListPopUp
     * @param {Object} callbacks - набор callback'ов, вызываемых на события попапа
     */
    constructor(callbacks) {
        super(null, template);
        this._bindCallBacks();
        this._callbacks = callbacks;
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        this._elements = {
            wrapper: document.getElementById('deletePopUpWrapperId'),
            closeBtn: document.getElementById('deletePopUpCloseId'),
            confirmBtn: document.getElementById('deletePopUpConfirmBtnId'),
            rejectBtn: document.getElementById('deletePopUpRejectBtnId'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._callbacks.onClose);
        this._elements.closeBtn?.addEventListener('click', this._callbacks.onClose);
        this._elements.confirmBtn?.addEventListener('click', this._callbacks.onConfirm);
        this._elements.rejectBtn?.addEventListener('click', this._callbacks.onReject);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._callbacks.onClose);
        this._elements.closeBtn?.removeEventListener('click', this._callbacks.onClose);
        this._elements.confirmBtn?.removeEventListener('click', this._callbacks.onConfirm);
        this._elements.rejectBtn?.removeEventListener('click', this._callbacks.onReject);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            cardListActions.hideDeleteCardListPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить"
     * @param {Event} event объект события
     * @private
     */
    _onConfirm(event) {
        event.preventDefault();
        cardListActions.deleteCardList(true);
    }

    /**
     * Callback, вызываемый при нажатии "Не удалять"
     * @param {Event} event объект события
     * @private
     */
    _onReject(event) {
        event.preventDefault();
        cardListActions.deleteCardList(false);
    }
}
