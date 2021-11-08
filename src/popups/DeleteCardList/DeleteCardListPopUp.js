// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './DeleteCardListPopUp.hbs';

// Actions
import {cardListActions} from '../../actions/cardlist.js';


/**
 * Класс popup'а удаления списка карточек
 */
export default class DeleteCardListPopUp extends BaseComponent {
    /**
     * Конструирует объект DeleteCardListPopUp
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
            wrapper: document.getElementById('deleteCLPopUpWrapperId'),
            closeBtn: document.getElementById('deleteCLPopUpCloseId'),
            confirmBtn: document.getElementById('deleteCLPopUpConfirmBtnId'),
            rejectBtn: document.getElementById('deleteCLPopUpRejectBtnId'),
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
        this._elements.confirmBtn?.addEventListener('click', this._onConfirm);
        this._elements.rejectBtn?.addEventListener('click', this._onReject);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
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
     * Метод биндит this контекст к callback методам
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
