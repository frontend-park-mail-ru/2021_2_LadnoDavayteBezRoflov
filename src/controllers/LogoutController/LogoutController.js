'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// utils
import network from '../../utils/Network/Network.js';
import router from '../../utils/Router/Router.js';
import userStatus from '../../utils/UserStatus/UserStatus.js';
import {httpStatusCodes, urls} from '../../utils/constants.js';

/**
 * Класс, реализующий контроллер для выхода из аккаунта пользователя.
 */
export default class LogoutController extends ControllerInterface {
    /**
     * Конструктор, создающий контроллер для выхода из аккаунта.
     */
    constructor() {
        super();
    }

    /**
     * Метод, реализующий логику контроллера и посылающий на сервер 
     * сообщение о выходе из аккаунта.
     * Клиент посылает на сервер delete-запрос с cookie, взамен получая код статуса удаления.
     * 
     * запрос: DELETE /api/sessions
     */
    async work() {
        const result = await network.sendLogout();
        /* result[0]: код статуса */
        if (result[0] === httpStatusCodes.ok) {
            userStatus.setAuthorized(false);
            userStatus.setUserName(null);

            router.toUrl(urls.login);
            return;
        }
        // TODO - красивый показ ошибок
        console.log(result[0]);
    }
}
