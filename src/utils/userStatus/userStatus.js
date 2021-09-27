'use strict';

// utils
import network from '../network/network.js';

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
        const result = await network.getUser();
        if (result[0] === 200) {
            this.setUserName(result[1]);
            this.setAuthorized(true);
            return;
        }

        this.setUserName(null);

        // TODO обработка ошибок
        console.log(result[0]);
    }

    /**
     * Метод-геттер, возвращающий текущий статус авторизации пользователя. 
     * @returns {boolean} статус авторизации
     */
    getAuthorized() {
        return this.isAuthorized;
    }

    /**
     * Метод-геттер, возвращающий имя пользователя. 
     * @returns {string} имя пользователя
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
     * @param {string} userName новое имя для установки
     */
    setUserName(userName) {
        this.userName = userName;
    }
}

export default new UserStatus();
