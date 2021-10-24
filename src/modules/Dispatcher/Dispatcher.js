/**
 * Класс, реализующий Диспетчер.
 */
class Dispatcher {
    /**
     * @constructor
     */
    constructor() {
        this._isDispatching = false;
        this._callbacks = new Map();
        this._lastId = 0;
    }

    /**
     * Метод, регистрирующий новый коллбек в диспетчере.
     * @param {Function} newCallback функция-коллбек
     */
    register(newCallback) {
        this._callbacks.set(this._lastId++, {callback: newCallback, isPending: false});
    }

    /**
     * Метод, удаляющий регистрацию коллбека.
     * @param {int} id
     */
    unregister(id) {
        if (this._callbacks.has(id)) {
            this._callbacks.delete(id);
            return;
        }
        throw new Error('Dispatcher: не существует запрошенного callback');
    }

    /**
     * Метод, организующий рассылку.
     * @param {Object | undefined} payload
     */
    dispatch(payload) {
        if (this.isDispatching()) {
            throw new Error('Dispatcher: метод dispatch должен быть запущен при выключенном Dispatcher');
        }

        this._startDispatching(payload);

        try {
            for (const [key, value] of this._callbacks) {
                if (value.isPending) {
                    continue;
                }
                this._invokeCallback(key);
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
        this._callbacks.get(id).isPending = true;
        this._callbacks.get(id).callback(this._pendingPayload);
    }

    /**
     * Метод, инициирующий рассылку действий.
     * @param {Object} payload
     */
    _startDispatching(payload) {
        for (const value of this._callbacks.values()) {
            value.isPending = false;
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    }

    /**
     * Метод, завершающий рассылку действий.
     */
    _stopDispatching() {
        delete this._pendingPayload;
        this._isDispatching = false;
    }
}

export default new Dispatcher();
