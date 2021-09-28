'use strict';

// utils
import {HttpStatusCodes} from '../constants.js';
import network from '../Network/Network.js';

/**
 * Класс, отвечающий за представление статуса пользователя.
 */
class UserStatus {
    /**
     * Конструктор, устанавливающий статус пользователя в
     * состояние "не авторизован и не определен"
     */
    constructor() {
        this.isAuthorized = false;
        this.userName = undefined;
    }

    /**
     * Метод инициализации, запрашивающий у сервера текущее состояние
     * пользователя с cookie (при наличии)
     * Клиент запрашивает у сервера userName, посылая сессионную cookie
     * Если на сервере cookie есть, то клиент обновляет свое состояние
     * и сохраняет userName
     * Иначе - попытка неудачна, у пользователя нет активной сессии,
     * следовательно, он является гостем.
     *
     * запрос: GET /api/user
     */
    async init() {
        const [result, username] = await network.getUser();
        if (result === HttpStatusCodes.Ok) {
            this.setUserName(username);
            this.setAuthorized(true);
            return;
        }
        this.setUserName(null);
        // TODO обработка ошибок
        console.log(result);
    }

    /**
     * Метод-геттер, возвращающий текущий статус авторизации пользователя.
     * @return {boolean} статус авторизации
     */
    getAuthorized() {
        return this.isAuthorized;
    }

    /**
     * Метод-геттер, возвращающий имя пользователя.
     * @return {string} имя пользователя
     */
    getUserName() {
        return this.userName;
    }

    /**
     * Метод-сеттер, устанавливающий значение "пользователь авторизован" в
     * новое значение.
     * @param {boolean} status новое значение для установки
     */
    setAuthorized(status) {
        this.isAuthorized = status;
    }

    /**
     * Метод-сеттер, устанавливающий имя пользователя в
     * новое значение.
     * @param {string | null} userName новое имя для установки
     */
    setUserName(userName) {
        this.userName = userName;
    }
}

export default new UserStatus();