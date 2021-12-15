// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './TagsListPopUp.hbs';

// Стили
import './TagsListPopUp.scss';

// Actions
import {tagsActions} from '../../actions/tags.js';

/**
 * Класс popup окна просмотра тегов.
 */
export default class TagsListPopUp extends BaseComponent {
    /**
     * Конструирует объект TagsListPopUp
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
        this._elements.wrapper?.addEventListener('click', this.onHideTagListPopUp);
        this._elements.closeBtn?.addEventListener('click', this.onHideTagListPopUp);
        this._elements.createBtn?.addEventListener('click', this.onShowTagCreatePopUp);
        if (this.context?.get('tags-list-popup').toggle_mode) {
            this._elements.tags?.forEach((tag) => {
                tag.addEventListener('click', this.onToggleTag);
            });
        } else {
            this._elements.tags?.forEach((tag) => {
                tag.addEventListener('click', this.onShowTagEditPopUp);
            });
        }
        this._elements.editTagBtns?.forEach((btn) => {
            btn.addEventListener('click', this.onShowTagEditPopUp);
        });
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this.onHideTagListPopUp);
        this._elements.closeBtn?.removeEventListener('click', this.onHideTagListPopUp);
        this._elements.createBtn?.removeEventListener('click', this.onShowTagCreatePopUp);
        if (this.context?.get('tags-list-popup').toggle_mode) {
            this._elements.tags?.forEach((tag) => {
                tag.removeEventListener('click', this.onToggleTag);
            });
        } else {
            this._elements.tags?.forEach((tag) => {
                tag.removeEventListener('click', this.onShowTagEditPopUp);
            });
        }
        this._elements.editTagBtns?.forEach((btn) => {
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
    onShowTagEditPopUp(event) {
        event.preventDefault();
        const tgid = event.target.closest('div.tags-list__tag-wrapper').dataset.id;
        tagsActions.showTagEditPopUp(tgid);
    }

    /**
     * Callback, вызываемый при нажатии "Добавить тег"
     * @param {Event} event объект события
     * @private
     */
    onShowTagCreatePopUp(event) {
        event.preventDefault();
        tagsActions.showTagCreatePopUp();
    }

    /**
     * Callback, вызываемый при нажатии на тег (в режиме toggle-mod)
     * @param {Event} event объект события
     * @private
     */
    onToggleTag(event) {
        event.preventDefault();
        const tgid = event.target.closest('div.tags-list__tag-wrapper').dataset.id;
        tagsActions.toggleTag(tgid);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    onHideTagListPopUp(event) {
        event.preventDefault();
        tagsActions.hideTagListPopUp();
    }
}
