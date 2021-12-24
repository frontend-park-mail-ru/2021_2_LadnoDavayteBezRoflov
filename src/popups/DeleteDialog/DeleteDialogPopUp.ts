// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './DeleteDialogPopUp.hbs' or it... Remove this comment to see the full error message
import template from './DeleteDialogPopUp.hbs';

/**
 * Класс popup'а удаления списка карточек
 */
export default class DeleteCardListPopUp extends BaseComponent {
    /**
     * Конструирует объект DeleteCardListPopUp
     * @param {Object} callbacks - набор callback'ов, вызываемых на события попапа
     */
    constructor(callbacks: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Dele... Remove this comment to see the full error message
        this._callbacks = callbacks;
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.confirmBtn?.addEventListener('click', this._callbacks.onConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.rejectBtn?.addEventListener('click', this._callbacks.onReject);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.confirmBtn?.removeEventListener('click', this._callbacks.onConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.rejectBtn?.removeEventListener('click', this._callbacks.onReject);
    }
}
