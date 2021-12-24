// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher';
import EventBus from '../modules/EventBus/EventBus';

/**
 * Класс, реализующий базовое хранилище.
 */
export default class BaseStore {
    _storage = new Map();
    readonly _changeEvent: string = 'change';
    _changed: boolean = false;
    _channel: string;

    /**
     * @constructor
     * @param {string} channelName имя канала EventBus
     */
    constructor(channelName: string) {
        this._invokeOnDispatch = this._invokeOnDispatch.bind(this);
        Dispatcher.register(this._invokeOnDispatch);

        EventBus.addChannel(channelName);
        this._channel = channelName;
    }

    /**
     * Метод, возвращающий текущее состояние (контекст) хранилища.
     * @param {string?} field возвращаемое поле
     * @return {string} контекст хранилища
     */
    getContext(field: string | null): string {
        return field ? this._storage.get(field) : this._storage;
    }

    /**
     * Метод, добавляющий нового слушателя в EventBus.
     * @param {function} callback функция-обработчик
     * @param {string?} changeEvent наименование события
     */
    addListener(callback: any, changeEvent: string | null = this._changeEvent) {
        EventBus.addListener(this._channel, changeEvent, callback);
    }

    /**
     * Метод, проверяющий, изменилось ли хранилище
     * @return {boolean} результат проверки
     */
    hasChanged(): boolean {
        // @ts-expect-error ts-migrate(2774) FIXME: This condition will always return true since the f... Remove this comment to see the full error message
        if (Dispatcher.isDispatching) {
            return this._changed;
        }

        throw new Error('Store: метод hasChanged должен быть вызван при работающем Dispatcher');
    }

    /**
     * Метод, устанавливающий статус "изменено".
     */
    _emitChange() {
        // @ts-expect-error ts-migrate(2774) FIXME: This condition will always return true since the f... Remove this comment to see the full error message
        if (Dispatcher.isDispatching) {
            this._changed = true;
            return;
        }

        throw new Error('Store: метод _emitChange должен быть вызван при работающем Dispatcher');
    }

    /**
     * Метод, реализующий обертку под _onDispatch.
     * @param {object} payload полезная нагрузка
     */
    async _invokeOnDispatch(payload: object) {
        this._changed = false;
        await this._onDispatch(payload);

        if (this.hasChanged()) {
            EventBus.emit(this._channel, this._changeEvent);
        }
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {object} payload полезная нагрузка запроса
     */
    async _onDispatch(payload: object) {
        throw new Error('Store: метод _onDispatch должен быть реализован в подклассе');
    }
}
