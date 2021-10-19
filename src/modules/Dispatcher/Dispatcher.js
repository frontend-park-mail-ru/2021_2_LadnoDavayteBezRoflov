'use strict';

/**
 * Класс, реализующий Диспетчер.
 */
class Dispatcher {
    /**
     * @constructor
     */
    constructor() {
        this._callbacks = new Map();
        this._isDispatching = false;
        this._isHandled = new Map();
        this._isPending = new Map();
        this._lastID = 1;
    }

    /**
     * Метод, регистрирующий новый коллбек в диспетчере.
     * @param {Function} newCallback функция-коллбек
     * @return {integer} айди коллбека
     */
    register(newCallback) {
        const id = `ID_${this._lastID++}`;
        this._callbacks[id] = newCallback;
        return id;
    }

    /**
     * Метод, удаляющий регистрацию коллбека.
     * @param {int} id
     */
    unregister(id) {
        if (this._callbacks[id]) {
            delete this._callbacks[id];
            return;
        }
        throw new Error('Dispatcher: не существует запрошенного callback');
    }

    /**
     * Метод, реализующий ожидание выполнения требуемых коллбеков.
     * @param {Array} ids айдишники, которых нужно ожидать
     */
    waitFor(ids) {
        if (this._isDispatching) {
            ids.forEach((id) => {
                if (this._isPending.get(id)) {
                    if (this._isHandled[id]) {
                        throw new Error('Dispatcher: кольцевая зависимость в waitFor');
                    }
                }
                if (!this._callbacks[id]) {
                    throw new Error('Dispatcher: не существует запрошенного callback');
                }

                this._invokeCallback(id);
            });
            return;
        }
        throw new Error('Dispatcher: метод waitFor должен быть запущен при работающем Dispatcher');
    }

    /**
     * Метод, организующий рассылку.
     * @param {Object} payload
     */
    dispatch(payload) {
        if (this._isDispatching) {
            throw new Error('Dispatcher: метод dispatch должен быть запущен при выключенном Dispatcher');
        }

        this._startDispatching(payload);

        try {
            for (const id in this._callbacks) {
                if (this._isPending[id]) {
                    continue;
                }
                this._invokeCallback(id);
            }
        } finally {
            this._stopDispatching();
        }
    }

    /**
     * Метод, возвращающий статус рассылки: активная или нет
     * @return {boolean} статус активности рассылки диспетчера
     */
    isDispatching() {
        return this._isDispatching;
    }

    /**
     * Метод, вызывающий функцию коллбека у id.
     * @param {int} id идентификатор коллбека
     */
    _invokeCallback(id) {
        this._isPending[id] = true;
        this._callbacks[id](this._pendingPayload);
        this._isHandled[id] = true;
    }

    /**
     * Метод, инициирующий рассылку действий.
     * @param {Object} payload
     */
    _startDispatching(payload) {
        for (const id in this._callbacks) {
            if (this._callbacks.hasOwnProperty(id)) {
                this._isPending[id] = false;
                this._isHandled[id] = false;
            }
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    }

    /**
     * Метод, завершщающий рассылку действий.
     */
    _stopDispatching() {
        delete this._pendingPayload;
        this._isDispatching = false;
    }
}

export default new Dispatcher();
