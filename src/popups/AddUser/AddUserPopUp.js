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
