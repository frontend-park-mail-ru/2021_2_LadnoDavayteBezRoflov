/**
 * Класс, реализующий Диспетчер.
 */
class Dispatcher {
    /**
     * @constructor
     */
    constructor() {
        this._callbacks = [];
        this._isDispatching = false;
        this._isHandled = [];
        this._isPending = [];
        this._lastID = 1;
    }

    /**
     * Метод, регистрирующий новый коллбек в диспетчере.
     * @param {Function} newCallback функция-коллбек
     * @return {String} айди коллбека
     */
    register(newCallback) {
        const id = `ID_${this._lastID++}`;
        // увеличиваем айди, возвращаем ИД_номер
        this._callbacks[id] = newCallback;
        // сеттим в коллбеки с нужным ид новый коллбек
        return id;
    }

    /**
     * Метод, удаляющий регистрацию коллбека.
     * @param {int} id
     */
    unregister(id) {
        if (this._callbacks[id]) {
            // если есть коллбек - удаляем
            delete this._callbacks[id];
            return;
        }
        // иначе ошибка
        throw new Error('Dispatcher: не существует запрошенного callback');
    }

    /**
     * Метод, реализующий ожидание выполнения требуемых коллбеков.
     * @param {Array} ids айдишники, которых нужно ожидать
     */
    waitFor(ids) {
        if (!this.isDispatching()) {
            throw new Error('Dispatcher: метод waitFor должен быть запущен при включенном Dispatcher');
        }
        // на каждый айди из переданных
        ids.forEach((id) => {
            // проверяем, обрабатывается ли коллбек
            if (this._isPending[id]) {
                if (this._isHandled[id]) {
                    // если уже обработали - ошибка
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

    /**
     * Метод, организующий рассылку.
     * @param {Object | undefined} payload
     */
    dispatch(payload = undefined) {
        if (this.isDispatching()) {
            throw new Error('Dispatcher: метод dispatch должен быть запущен при выключенном Dispatcher');
        }

        this._startDispatching(payload);

        try {
            for (const id in this._callbacks) {
                // если уже обрабатывается - пропускаем
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
        // начинаем обработку - isPending true
        this._isPending[id] = true;
        this._callbacks[id](this._pendingPayload);
        // прекращаем обработку - _isHandled true
        this._isHandled[id] = true;
    }

    /**
     * Метод, инициирующий рассылку действий.
     * @param {Object} payload
     */
    _startDispatching(payload) {
        for (const id in this._callbacks) {
            if (this._callbacks.hasOwnProperty(id)) {
                // ставим для каждого айди флаг, что он не активен и не обработан
                this._isPending[id] = false;
                this._isHandled[id] = false;
            }
        }
        // устанавливаем новый пейлоад
        this._pendingPayload = payload;
        // переводим в состояние активности
        this._isDispatching = true;
    }

    /**
     * Метод, завершщающий рассылку действий.
     */
    _stopDispatching() {
        // удаляем полезную нагрузку, которую раздавали, выключаемся
        delete this._pendingPayload;
        this._isDispatching = false;
    }
}

export default new Dispatcher();
