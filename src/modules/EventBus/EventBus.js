/**
 * Класс, реализующий EventBus.
 */
class EventBus {
    /**
     * @constructor
     */
    constructor() {
        this._channels = {};
    }

    /**
     * Метод, создающий новый канал.
     * @param {String} name название канала
     */
    addChannel(name) {
        this._channels[name] = {};
    }

    /**
     * Метод, добавляющий слушателя.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {Function} callback коллбек, вызывающийся при получении события
     */
    addListener(channel, event, callback) {
        if (!this._channels[channel]) {
            throw new Error('EventBus: указанный канал не сущестует: ', channel);
        }

        if (!this._channels[channel][event]) {
            this._channels[channel][event] = new Set();
        }

        this._channels[channel][event].add(callback);
    }

    /**
     * Метод, убирающий слушателя.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {Function} callback коллбек, вызывающийся при получении события
     */
    removeListener(channel, event, callback) {
        if (!this._channels[channel]) {
            throw new Error('EventBus: указанный канал не сущестует: ', channel);
        }

        this._channels[channel][event]?.delete(callback);
    }

    /**
     * Метод, посылающий событие по EventBus.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {*} args дополнительные аргументы
     */
    emit(channel, event, args = null) {
        console.log(`[${channel}] emitted: ${event} with args ${args}`);
        this._channels[channel][event]?.forEach((callback) => {
            callback(args);
        });
    }
}

export default new EventBus;
