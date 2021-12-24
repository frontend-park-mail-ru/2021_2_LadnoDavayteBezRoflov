/**
 * Класс, реализующий EventBus.
 */
class EventBus {
    /**
     * @constructor
     */
    constructor() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        this._channels = {};
    }

    /**
     * Метод, создающий новый канал.
     * @param {String} name название канала
     */
    addChannel(name: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        this._channels[name] = {};
    }

    /**
     * Метод, добавляющий слушателя.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {Function} callback коллбек, вызывающийся при получении события
     */
    addListener(channel: any, event: any, callback: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        if (!this._channels[channel]) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
            throw new Error('EventBus: указанный канал не сущестует: ', channel);
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        if (!this._channels[channel][event]) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
            this._channels[channel][event] = new Set();
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        this._channels[channel][event].add(callback);
    }

    /**
     * Метод, убирающий слушателя.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {Function} callback коллбек, вызывающийся при получении события
     */
    removeListener(channel: any, event: any, callback: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        if (!this._channels[channel]) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
            throw new Error('EventBus: указанный канал не сущестует: ', channel);
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        this._channels[channel][event]?.delete(callback);
    }

    /**
     * Метод, посылающий событие по EventBus.
     * @param {String} channel имя канала
     * @param {String} event имя события
     * @param {*?} args дополнительные аргументы
     */
    emit(channel: any, event: any, args = null) {
        console.log(`[${channel}] emitted: ${event} with args ${args}`);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_channels' does not exist on type 'Event... Remove this comment to see the full error message
        this._channels[channel][event]?.forEach((callback: any) => {
            callback(args);
        });
    }
}

export default new EventBus;
