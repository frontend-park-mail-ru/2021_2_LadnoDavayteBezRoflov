// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './DeleteCardListPopUp.hbs' or ... Remove this comment to see the full error message
import template from './DeleteCardListPopUp.hbs';

// Actions
import {cardListActions} from '../../actions/cardlist';


/**
 * Класс popup'а удаления списка карточек
 */
export default class DeleteCardListPopUp extends BaseComponent {
    /**
     * Конструирует объект DeleteCardListPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.confirmBtn?.addEventListener('click', this._onConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.rejectBtn?.addEventListener('click', this._onReject);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        this._elements.confirmBtn?.removeEventListener('click', this._onConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
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
    _onPopUpClose(event: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Delet... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            cardListActions.hideDeleteCardListPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить"
     * @param {Event} event объект события
     * @private
     */
    _onConfirm(event: any) {
        event.preventDefault();
        cardListActions.deleteCardList(true);
    }

    /**
     * Callback, вызываемый при нажатии "Не удалять"
     * @param {Event} event объект события
     * @private
     */
    _onReject(event: any) {
        event.preventDefault();
        cardListActions.deleteCardList(false);
    }
}
