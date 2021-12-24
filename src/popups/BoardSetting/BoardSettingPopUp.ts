// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './BoardSettingPopUp.hbs' or it... Remove this comment to see the full error message
import template from './BoardSettingPopUp.hbs';

// Actions
import {boardActions} from '../../actions/board';

// Стили
import './BoardSettingPopUp.scss';

/**
 * Класс popup окна настроек доски
 */
export default class BoardSettingPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements = {
            wrapper: document.getElementById('boardSettingPopUpWrapperId'),
            saveBtn: document.getElementById('boardSettingPopUpSaveBtnId'),
            title: document.getElementById('boardSettingPopUpTitleId'),
            description: document.getElementById('boardSettingPopUpDescriptionId'),
            deleteBtn: document.getElementById('boardSettingPopUpDeleteBtnId'),
            confirmBtn: document.getElementById('boardSettingPopUpDeleteConfirmBtnId'),
            rejectBtn: document.getElementById('boardSettingPopUpDeleteRejectBtnId'),
            closeBtn: document.getElementById('boardSettingPopUpCloseId'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.deleteBtn?.addEventListener('click', this._onDelete);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.confirmBtn?.addEventListener('click', this._onDeleteConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.rejectBtn?.addEventListener('click', this._onRejectConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.saveBtn?.addEventListener('click', this._onSave);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.title?.focus();
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.deleteBtn?.removeEventListener('click', this._onDelete);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.confirmBtn?.removeEventListener('click', this._onDeleteConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.rejectBtn?.removeEventListener('click', this._onRejectConfirm);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.saveBtn?.removeEventListener('click', this._onSave);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onDelete = this._onDelete.bind(this);
        this._onDeleteConfirm = this._onDeleteConfirm.bind(this);
        this._onRejectConfirm = this._onRejectConfirm.bind(this);
        this._onSave = this._onSave.bind(this);
    }

    /**
     * Callback, вызываемый при закрытии окна настроек
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            boardActions.hideBoardSettingsPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить доску"
     * @param {Event} event объект события
     * @private
     */
    _onDelete(event: any) {
        event.preventDefault();
        boardActions.showConfirmDeleteBoard();
    }

    /**
     * Callback, вызываемый при подтверждении удаления доски
     * @param {Event} event объект события
     * @private
     */
    _onDeleteConfirm(event: any) {
        event.preventDefault();
        boardActions.hideConfirmDeleteBoard(true);
    }

    /**
     * Callback, вызываемый при отклонении удаления доски
     * @param {Event} event объект события
     * @private
     */
    _onRejectConfirm(event: any) {
        event.preventDefault();
        boardActions.hideConfirmDeleteBoard(false);
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event: any) {
        event.preventDefault();
        boardActions.updateBoardTitleDescription(
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
            this._elements.title.value,
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
            this._elements.description.value,
        );
    }
}
