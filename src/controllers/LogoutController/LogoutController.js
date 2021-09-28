'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// utils
import network from '../../utils/Network/Network.js';
import router from '../../utils/Router/Router.js';
import userStatus from '../../utils/UserStatus/UserStatus.js';
import { HttpStatusCodes, Urls } from '../../utils/constants.js';

/**
 * Класс, реализующий контроллер для выхода из аккаунта пользователя.
 */
export default class LogoutController extends ControllerInterface {
  /**
     * Метод, реализующий логику контроллера и посылающий на сервер
     * сообщение о выходе из аккаунта.
     * Клиент посылает на сервер delete-запрос с cookie, взамен получая код статуса удаления.
     *
     * запрос: DELETE /api/sessions
     */
  async work() {
    const [result] = await network.sendLogout();
    if (result === HttpStatusCodes.Ok) {
      userStatus.setAuthorized(false);
      userStatus.setUserName(null);
      router.toUrl(Urls.Login);
      return;
    }
    // TODO - красивый показ ошибок
    console.log(result);
  }
}
