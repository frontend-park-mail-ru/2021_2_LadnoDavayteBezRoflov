// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './AddUserPopUp.hbs';

// Стили
import './AddUserPopUp.scss';

/**
 * Класс popup окна добавления пользователя.
 */
export default class AddUserPopUp extends BaseComponent {
    /**
     * Конструирует объект AddUserPopUp
     * @param {Object} callbacks - набор callback'ов, вызываемых на события попапа
     */
    constructor(callbacks) {
        super(null, template);
        this._callbacks = callbacks;
        this._elements = {};
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
    addEventListeners() {
        this._registerPopUpElements();
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
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        this._elements.deleteBtn?.removeEventListener('click', this._onDelete);
        this._elements.confirmBtn?.removeEventListener('click', this._onDeleteConfirm);
        this._elements.rejectBtn?.removeEventListener('click', this._onRejectConfirm);
        this._elements.saveBtn?.removeEventListener('click', this._onSave);
    }
}
