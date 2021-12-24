// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './CardListPopUp.hbs' or its co... Remove this comment to see the full error message
import template from './CardListPopUp.hbs';

// Actions
import {cardListActions} from '../../actions/cardlist';


/**
 * Класс popup окна создания и редактирования списка карточек
 */
export default class CardListPopUp extends BaseComponent {
    /**
     * Конструирует объект CardListPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.createBtn?.addEventListener('click', this._onCreate);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.saveBtn?.addEventListener('click', this._onSave);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.title?.focus();
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        this._elements.createBtn?.removeEventListener('click', this._onCreate);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
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
    _onPopUpClose(event: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            cardListActions.hideCardListPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event: any) {
        event.preventDefault();
        cardListActions.updateCardList(
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
            parseInt(this._elements.positionSelect.value, 10),
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
            this._elements.title.value,
        );
    }

    /**
     * Callback, вызываемый при нажатии "Создать"
     * @param {Event} event объект события
     * @private
     */
    _onCreate(event: any) {
        event.preventDefault();
        cardListActions.createCardList(
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'CardL... Remove this comment to see the full error message
            this._elements.title.value,
        );
    }
}
