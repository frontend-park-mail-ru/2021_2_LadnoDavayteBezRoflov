// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './AddUserPopUp.hbs' or its cor... Remove this comment to see the full error message
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
    constructor(callbacks: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'AddU... Remove this comment to see the full error message
        this._callbacks = callbacks;
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'AddUser... Remove this comment to see the full error message
        if (!this.context.visible) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
            this._elements = {};
            return;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements = {
            wrapper: document.getElementById('addUserPopUpWrapperId'),
            input: document.getElementById('addUserPopUpSearchInputId'),
            users: document.querySelectorAll('.search-result'),
            closeBtn: document.getElementById('addUserPopUpCloseId'),
            inviteInput: document.getElementById('inviteLinkInputId'),
            inviteRefreshBtn: document.getElementById('refreshLinkId'),
            inviteCopyBtn: document.getElementById('copyLinkId'),
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.input?.addEventListener('input', this._callbacks.onInput);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.users?.forEach((user: any) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'AddU... Remove this comment to see the full error message
            user.addEventListener('click', this._callbacks.onUserClick);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.inviteRefreshBtn?.addEventListener('click', this._callbacks.onRefreshInvite);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.inviteCopyBtn?.addEventListener('click', this._callbacks.onCopyInvite);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._callbacks.onClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.input?.removeEventListener('click', this._callbacks.onInput);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.users?.forEach((user: any) => {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'AddU... Remove this comment to see the full error message
            user.removeEventListener('click', this._callbacks.onUserClick);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.inviteRefreshBtn?.removeEventListener('click', this._callbacks.onRefreshInvite);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.inviteCopyBtn?.removeEventListener('click', this._callbacks.onCopyInvite);
    }

    /**
     * Метод устанавливает курсор в конце строки внутри input тэга
     * @private
     */
    _setUpSearchInput() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'AddUser... Remove this comment to see the full error message
        if (this.context.selectInvite) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
            this._elements.inviteInput?.focus();
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
            this._elements.inviteInput?.select();
            return;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.input?.focus();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
        this._elements.input?.setSelectionRange(this._elements.input.value.length,
                                                // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'AddUs... Remove this comment to see the full error message
                                                this._elements.input.value.length);
    }
}
