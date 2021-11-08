// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Стор
import BoardStore from '../../stores/BoardStore/BoardStore.js';

// Шаблон
import template from './BoardSettingPopUp.hbs';

// Actions
import {boardActions} from '../../actions/board.js';

// Стили
import './BoardSettingPopUp.scss';

/**
 * Класс popup окна настроек доски
 */
export default class BoardSettingPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
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
        this._setContext(BoardStore.getSettingPopUpContext());
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
    _addEventListeners() {
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.deleteBtn?.addEventListener('click', this._onDelete);
        this._elements.confirmBtn?.addEventListener('click', this._onDeleteConfirm);
        this._elements.rejectBtn?.addEventListener('click', this._onRejectConfirm);
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
        this._elements.deleteBtn?.removeEventListener('click', this._onDelete);
        this._elements.confirmBtn?.removeEventListener('click', this._onDeleteConfirm);
        this._elements.rejectBtn?.removeEventListener('click', this._onRejectConfirm);
        this._elements.saveBtn?.removeEventListener('click', this._onSave);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onStoreRefresh = this._onStoreRefresh.bind(this);
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
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            boardActions.hideBoardSettingsPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить доску"
     * @param {Event} event объект события
     * @private
     */
    _onDelete(event) {
        event.preventDefault();
        boardActions.showConfirmDeleteBoard();
    }

    /**
     * Callback, вызываемый при подтверждении удаления доски
     * @param {Event} event объект события
     * @private
     */
    _onDeleteConfirm(event) {
        event.preventDefault();
        boardActions.hideConfirmDeleteBoard(true);
    }

    /**
     * Callback, вызываемый при отклонении удаления доски
     * @param {Event} event объект события
     * @private
     */
    _onRejectConfirm(event) {
        event.preventDefault();
        boardActions.hideConfirmDeleteBoard(false);
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event) {
        event.preventDefault();
        boardActions.updateBoardTitleDescription(
            this._elements.title.value,
            this._elements.description.value,
        );
    }
}
