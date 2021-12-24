// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './TagPopUp.hbs' or its corresp... Remove this comment to see the full error message
import template from './TagPopUp.hbs';

// Стили
import './TagPopUp.scss';

// Actions
import {tagsActions} from '../../actions/tags';

/**
 * Класс popup окна редактирования/создания тега.
 */
export default class TagPopUp extends BaseComponent {
    /**
     * Конструирует объект TagPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this.onHideTagPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this.onHideTagPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.createBtn?.addEventListener('click', this.onCreateTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.deleteBtn?.addEventListener('click', this.onDeleteTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.updateBtn?.addEventListener('click', this.onUpdateTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.input?.addEventListener('input', this.onEditTagName);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.colors?.forEach((color: any) => {
            color.addEventListener('click', this.onPickColor);
        });
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this.onHideTagPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this.onHideTagPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.createBtn?.removeEventListener('click', this.onCreateTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.deleteBtn?.removeEventListener('click', this.onDeleteTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.updateBtn?.removeEventListener('click', this.onUpdateTag);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.input?.removeEventListener('input', this.onEditTagName);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        this._elements.colors?.forEach((color: any) => {
            color.removeEventListener('click', this.onPickColor);
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
        this.onEditTagName = this.onEditTagName.bind(this);
    }


    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    onHideTagPopUp(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            tagsActions.hideTagPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии на "создать"
     * @param {Event} event объект события
     * @private
     */
    onCreateTag(event: any) {
        event.preventDefault();
        tagsActions.createTag(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатии на "удалить"
     * @param {Event} event объект события
     * @private
     */
    onDeleteTag(event: any) {
        event.preventDefault();
        tagsActions.deleteTag();
    }

    /**
     * Callback, вызываемый при нажатии на "сохранить"
     * @param {Event} event объект события
     * @private
     */
    onUpdateTag(event: any) {
        event.preventDefault();
        tagsActions.updateTag();
    }

    /**
     * Callback, вызываемый при нажатии на цвет
     * @param {Event} event объект события
     * @private
     */
    onPickColor(event: any) {
        event.preventDefault();
        tagsActions.pickColor(Number.parseInt(event.target.dataset.id, 10));
    }

    /**
     * Callback, вызываемый при изменении текста в инпуте
     * @param {Event} event объект события
     * @private
     */
    onEditTagName(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagPo... Remove this comment to see the full error message
        tagsActions.editTagName(this._elements.input.value);
    }
}
