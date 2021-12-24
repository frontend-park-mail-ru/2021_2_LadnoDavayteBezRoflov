/**
 * Класс, реализующий Диспетчер.
 */
class Dispatcher {
    /**
     * @constructor
     */
    constructor() {
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_isDispatching' does not exist on type '... Remove this comment to see the full error message
        this._isDispatching = false;
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        this._callbacks = new Map();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_lastId' does not exist on type 'Dispatc... Remove this comment to see the full error message
        this._lastId = 0;
    }

    /**
     * Метод, регистрирующий новый коллбек в диспетчере.
     * @param {Function} newCallback функция-коллбек
     */
    register(newCallback: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        this._callbacks.set(this._lastId++, {callback: newCallback, isPending: false});
    }

    /**
     * Метод, удаляющий регистрацию коллбека.
     * @param {int} id
     */
    unregister(id: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        if (this._callbacks.has(id)) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
            this._callbacks.delete(id);
            return;
        }
        throw new Error('Dispatcher: не существует запрошенного callback');
    }

    /**
     * Метод, организующий рассылку.
     * @param {Object?} payload
     */
    dispatch(payload: any) {
        if (this.isDispatching()) {
            throw new Error('Dispatcher: метод dispatch должен быть запущен при выключенном Dispatcher');
        }

        this._startDispatching(payload);

        try {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_isDispatching' does not exist on type '... Remove this comment to see the full error message
        return this._isDispatching;
    }

    /**
     * Метод, вызывающий функцию коллбека у id.
     * @param {int} id идентификатор коллбека
     */
    _invokeCallback(id: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        this._callbacks.get(id).isPending = true;
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        this._callbacks.get(id).callback(this._pendingPayload);
    }

    /**
     * Метод, инициирующий рассылку действий.
     * @param {Object} payload
     */
    _startDispatching(payload: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_callbacks' does not exist on type 'Disp... Remove this comment to see the full error message
        for (const value of this._callbacks.values()) {
            value.isPending = false;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_pendingPayload' does not exist on type ... Remove this comment to see the full error message
        this._pendingPayload = payload;
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_isDispatching' does not exist on type '... Remove this comment to see the full error message
        this._isDispatching = true;
    }

    /**
     * Метод, завершающий рассылку действий.
     */
    _stopDispatching() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_pendingPayload' does not exist on type ... Remove this comment to see the full error message
        delete this._pendingPayload;
        // @ts-expect-error ts-migrate(2551) FIXME: Property '_isDispatching' does not exist on type '... Remove this comment to see the full error message
        this._isDispatching = false;
    }
}

export default new Dispatcher();
