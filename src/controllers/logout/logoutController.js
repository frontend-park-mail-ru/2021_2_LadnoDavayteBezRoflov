'use strict';

// Интерфейс контроллера
import ControllerInterface from '../baseController.js';

// utils
import network from '../../utils/network/network.js';
import router from '../../utils/router/router.js';
import userStatus from '../../utils/userStatus/userStatus.js';

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
        if (result[0] === 200) {
            userStatus.setAuthorized(false);
            userStatus.setUserName(null);

            router.toUrl('/login');
            return;
        }
        // TODO - красивый показ ошибок
        console.log(result[0]);
    }
}
