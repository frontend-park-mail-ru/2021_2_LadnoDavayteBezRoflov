// Базовый компонент
import BaseComponent from '../BaseComponent';
// Стили

import './OfflineMessage.scss';
import UserStore from '../../stores/UserStore/UserStore';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './OfflineMessage.hbs' or its c... Remove this comment to see the full error message
import template from './OfflineMessage.hbs';

// Action
import {serviceWorkerActions} from '../../actions/serviceworker';


/**
 * Класс, реализующий компонент OfflineMessage.
 */
export default class OfflineMessage extends BaseComponent {
    /**
     * Конструктор, создающий класс компонента OfflineMessage.
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(context, template);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements = {};
        this._bindCallBacks();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении компонента.
     */
    _onRefresh() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Offline... Remove this comment to see the full error message
        this.context = UserStore.getContext();
    }

    /**
     * Метод биндит callback'и к this
     * @private
     */
    _bindCallBacks() {
        this._onClose = this._onClose.bind(this);
        this._onOpen = this._onOpen.bind(this);
    }

    /**
     * Метод сохраняет элементы DOM связанные с navbar
     * @private
     */
    _registerElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements = {
            wrapper: document.getElementById('offlineMessageShowId'),
            close: document.getElementById('offlineMessageCloseId'),
        };
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
        this._registerElements();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._onOpen);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements.close?.addEventListener('click', this._onClose);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._onOpen);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Offli... Remove this comment to see the full error message
        this._elements.close?.removeEventListener('click', this._onClose);
    }

    /**
     * CallBack на закрытие сообщения
     * @param {Event} event объект события
     * @private
     */
    _onClose(event: any) {
        event.preventDefault();
        serviceWorkerActions.onCloseOfflineMessage();
    }


    /**
     * CallBack на открытие сообщения
     * @param {Event} event объект события
     * @private
     */
    _onOpen(event: any) {
        event.preventDefault();
        serviceWorkerActions.onOpenOfflineMessage();
    }
}
