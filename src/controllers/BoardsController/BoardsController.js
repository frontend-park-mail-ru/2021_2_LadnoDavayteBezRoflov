'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// Страница списка досок
import BoardsPage from '../../pages/BoardsPage/BoardsPage.js';

// utils
import network from '../../utils/Network/Network.js';
import router from '../../utils/Router/Router.js';
import {httpStatusCodes, urls} from '../../utils/constants.js';

/**
 * Класс, реализующий контроллер для страницы списка досок.
 */
export default class BoardsController extends ControllerInterface {
    /**
     * Конструктор, создающий контроллер для страницы списка досок.
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        super();
        this.page = new BoardsPage(parent);
    }

    async work() {
        const result = await network.getBoards();
        /* result[0]: код статуса, result[1]: список команд пользователя и связанные с ними доски */
        if (result[0] === httpStatusCodes.ok) {
            return this.page.render(result[1]);
        }
        
        router.toUrl(urls.login);
        
    }
}
