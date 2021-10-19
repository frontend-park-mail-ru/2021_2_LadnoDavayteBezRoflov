'use strict';

/**
 * Класс, реализующий EventBus.
 */
class EventBus {
    /**
     * @constructor
     */
    constructor() {
        this._listeners = {};
    }

    /**
     * Метод, добавляющий слушателя.
     * @param {*} event
     * @param {*} callback
     */
    addListener(event, callback) {
        if (!(event in this._listeners)) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    /**
     * Метод, убирающий слушателя.
     * @param {*} event
     * @param {*} callback
     */
    removeListener(event, callback) {
        this._listeners = this._listeners || {};
        if (!(event in this._listeners)) {
            return;
        }
        this._listeners[event].splice(this._listeners[event].indexOf(callback), 1);
    }

    /**
     * Метод, посылающий событие по EventBus.
     * @param {*} event
     * @param {*} args
     */
    emit(event, args = null) {
        console.log('[EventBus] emitted: ', event);
        if (event in this._listeners) {
            this._listeners[event].forEach((callback) => {
                try {
                    callback(args);
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
}

export default new EventBus;
