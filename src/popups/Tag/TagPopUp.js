// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './TagPopUp.hbs';

// Стили
import './TagPopUp.scss';

// Actions
import {tagsActions} from '../../actions/tags.js';

/**
 * Класс popup окна редактирования/создания тега.
 */
export default class TagPopUp extends BaseComponent {
    /**
     * Конструирует объект TagPopUp
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
            wrapper: document.getElementById('tagPopUpWrapperId'),
            closeBtn: document.getElementById('tagPopUpCloseId'),
            createBtn: document.getElementById('tagPopUpCreateBtnId'),
            deleteBtn: document.getElementById('tagPopUpDeleteBtnId'),
            updateBtn: document.getElementById('tagPopUpSaveBtnId'),
            input: document.getElementById('tagNameInputId'),
            colors: document.querySelectorAll('.tag-colors__color'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper.addEventListeners('click', this.onHideTagPopUp);
        this._elements.closeBtn.addEventListeners('click', this.onHideTagPopUp);
        this._elements.createBtn.addEventListeners('click', this.onCreateTag);
        this._elements.deleteBtn.addEventListeners('click', this.onDeleteTag);
        this._elements.updateBtn.addEventListeners('click', this.onUpdateTag);
        this._elements.colors.forEach((color) => {
            color.addEventListeners('click', this.onPickColor);
        });
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper.removeEventListeners('click', this.onHideTagPopUp);
        this._elements.closeBtn.removeEventListeners('click', this.onHideTagPopUp);
        this._elements.createBtn.removeEventListeners('click', this.onCreateTag);
        this._elements.deleteBtn.removeEventListeners('click', this.onDeleteTag);
        this._elements.updateBtn.removeEventListeners('click', this.onUpdateTag);
        this._elements.colors.forEach((color) => {
            color.removeEventListeners('click', this.onPickColor);
        });
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this.onHideTagPopUp = this.onHideTagPopUp.bind(this);
        this.onCreateTag = this.onCreateTag.bind(this);
        this.onDeleteTag = this.onDeleteTag.bind(this);
        this.onUpdateTag = this.onUpdateTag.bind(this);
        this.onPickColor = this.onPickColor.bind(this);
    }


    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    onHideTagPopUp(event) {
        event.preventDefault();
        tagsActions.hideTagPopUp();
    }

    /**
     * Callback, вызываемый при нажатии на "создать"
     * @param {Event} event объект события
     * @private
     */
    onCreateTag(event) {
        event.preventDefault();
        tagsActions.createTag(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатии на "удалить"
     * @param {Event} event объект события
     * @private
     */
    onDeleteTag(event) {
        event.preventDefault();
        tagsActions.deleteTag();
    }

    /**
     * Callback, вызываемый при нажатии на "сохранить"
     * @param {Event} event объект события
     * @private
     */
    onUpdateTag(event) {
        event.preventDefault();
        tagsActions.updateTag(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатии на цвет
     * @param {Event} event объект события
     * @private
     */
    onPickColor(event) {
        event.preventDefault();
        tagsActions.pickColor(Number.parseInt(event.target.dataset.id, 10));
    }
}
