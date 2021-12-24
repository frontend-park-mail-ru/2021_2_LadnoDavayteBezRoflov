// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './TagsListPopUp.hbs' or its co... Remove this comment to see the full error message
import template from './TagsListPopUp.hbs';

// Стили
import './TagsListPopUp.scss';

// Actions
import {tagsActions} from '../../actions/tags';

/**
 * Класс popup окна просмотра тегов.
 */
export default class TagsListPopUp extends BaseComponent {
    /**
     * Конструирует объект TagsListPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements = {
            wrapper: document.getElementById('tagListPopUpWrapperId'),
            closeBtn: document.getElementById('tagListPopUpCloseId'),
            createBtn: document.getElementById('showTagPopUpBtnId'),
            tags: document.querySelectorAll('.tags-list__tag'),
            editTagBtns: document.querySelectorAll('.tags-list__edit-btn'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this.onHideTagListPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this.onHideTagListPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.createBtn?.addEventListener('click', this.onShowTagCreatePopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'TagsLis... Remove this comment to see the full error message
        if (this.context?.get('tags-list-popup').toggle_mode) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
            this._elements.tags?.forEach((tag: any) => {
                tag.addEventListener('click', this.onToggleTag);
            });
        } else {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
            this._elements.tags?.forEach((tag: any) => {
                tag.addEventListener('click', this.onShowTagEditPopUp);
            });
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.editTagBtns?.forEach((btn: any) => {
            btn.addEventListener('click', this.onShowTagEditPopUp);
        });
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this.onHideTagListPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this.onHideTagListPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.createBtn?.removeEventListener('click', this.onShowTagCreatePopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'TagsLis... Remove this comment to see the full error message
        if (this.context?.get('tags-list-popup').toggle_mode) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
            this._elements.tags?.forEach((tag: any) => {
                tag.removeEventListener('click', this.onToggleTag);
            });
        } else {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
            this._elements.tags?.forEach((tag: any) => {
                tag.removeEventListener('click', this.onShowTagEditPopUp);
            });
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        this._elements.editTagBtns?.forEach((btn: any) => {
            btn.removeEventListener('click', this.onShowTagEditPopUp);
        });
    };

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this.onShowTagEditPopUp = this.onShowTagEditPopUp.bind(this);
        this.onShowTagCreatePopUp = this.onShowTagCreatePopUp.bind(this);
        this.onToggleTag = this.onToggleTag.bind(this);
        this.onHideTagListPopUp = this.onHideTagListPopUp.bind(this);
    }

    /**
     * Callback, вызываемый при нажатии на редактирование тега
     * @param {Event} event объект события
     * @private
     */
    onShowTagEditPopUp(event: any) {
        event.preventDefault();
        const tgid = Number.parseInt(event.target.closest('div.tags-list__tag-wrapper')
            .dataset.id, 10);
        tagsActions.showTagEditPopUp(tgid);
    }

    /**
     * Callback, вызываемый при нажатии "Добавить тег"
     * @param {Event} event объект события
     * @private
     */
    onShowTagCreatePopUp(event: any) {
        event.preventDefault();
        tagsActions.showTagCreatePopUp();
    }

    /**
     * Callback, вызываемый при нажатии на тег (в режиме toggle-mod)
     * @param {Event} event объект события
     * @private
     */
    onToggleTag(event: any) {
        event.preventDefault();
        const tgid = Number.parseInt(event.target.closest('div.tags-list__tag-wrapper')
            .dataset.id, 10);
        tagsActions.toggleTag(tgid);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    onHideTagListPopUp(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'TagsL... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            tagsActions.hideTagListPopUp();
        }
    }
}
