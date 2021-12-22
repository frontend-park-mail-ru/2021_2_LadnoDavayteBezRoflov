// Базовый компонент
import BaseComponent from '../BaseComponent.js';
// Стили

import './OfflineMessage.scss';
import UserStore from '../../stores/UserStore/UserStore.js';

// Шаблон
import template from './OfflineMessage.hbs';

// Action
import {serviceWorkerActions} from '../../actions/serviceworker.js';


/**
 * Класс, реализующий компонент OfflineMessage.
 */
export default class OfflineMessage extends BaseComponent {
    /**
     * Конструктор, создающий класс компонента OfflineMessage.
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context) {
        super(context, template);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);

        this._elements = {};
        this._bindCallBacks();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении компонента.
     */
    _onRefresh() {
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
        this._elements.wrapper?.addEventListener('click', this._onOpen);
        this._elements.close?.addEventListener('click', this._onClose);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        this._elements.wrapper?.removeEventListener('click', this._onOpen);
        this._elements.close?.removeEventListener('click', this._onClose);
    }

    /**
     * CallBack на закрытие сообщения
     * @param {Event} event объект события
     * @private
     */
    _onClose(event) {
        event.preventDefault();
        serviceWorkerActions.onCloseOfflineMessage();
    }


    /**
     * CallBack на открытие сообщения
     * @param {Event} event объект события
     * @private
     */
    _onOpen(event) {
        event.preventDefault();
        serviceWorkerActions.onOpenOfflineMessage();
    }
}
