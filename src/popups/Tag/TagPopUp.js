// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './TagPopUp.hbs';

// Стили
import './TagPopUp.scss';

// Actions


/**
 * Класс popup окна редактирования/создания тега.
 */
export default class TagPopUp extends BaseComponent {
    /**
     * Конструирует объект TagPopUp
     */
    constructor() {
        super(null, template);
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        if (!this.context.visible) {
            this._elements = {};
            return;
        }
        this._elements = {
            wrapper: document.getElementById('addUserPopUpWrapperId'),
            input: document.getElementById('addUserPopUpSearchInputId'),
            users: document.querySelectorAll('.search-result'),
            closeBtn: document.getElementById('addUserPopUpCloseId'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        this._setUpSearchInput();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._callbacks.onClose);
        this._elements.closeBtn?.addEventListener('click', this._callbacks.onClose);
        this._elements.input?.addEventListener('input', this._callbacks.onInput);
        this._elements.users?.forEach((user)=>{
            user.addEventListener('click', this._callbacks.onUserClick);
        });
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._callbacks.onClose);
        this._elements.closeBtn?.removeEventListener('click', this._callbacks.onClose);
        this._elements.input?.removeEventListener('click', this._callbacks.onInput);
        this._elements.users?.forEach((user)=>{
            user.removeEventListener('click', this._callbacks.onUserClick);
        });
    }

    /**
     * Метод устанавливает курсор в конце строки внутри input тэга
     * @private
     */
    _setUpSearchInput() {
        this._elements.input?.focus();
        this._elements.input?.setSelectionRange(this._elements.input.value.length,
                                                this._elements.input.value.length);
    }
}
