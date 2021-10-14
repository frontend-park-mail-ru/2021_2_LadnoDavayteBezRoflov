'use strict';

// Интерфейс контроллера
import ControllerInterface from '../BaseController.js';

// Страница списка досок
import BoardsPage from '../../pages/BoardsPage/BoardsPage.js';

// utils
import network from '../../utils/Network/Network.js';
import router from '../../utils/Router/Router.js';
import {HttpStatusCodes, Urls} from '../../utils/constants.js';

/**
 * Класс, реализующий контроллер для страницы списка досок.
 */
export default class BoardsController extends ControllerInterface {
    /**
     * Конструктор, создающий контроллер для страницы списка досок.
     * @param {Element} parent HTML-элемент, в который будет
     * осуществлена отрисовка
     */
    constructor(parent) {
        super();
        this.page = new BoardsPage(parent);
    }

    /**
     * Метод, реализующий логику контроллера страницы досок.
     */
    async work() {
        const [result, boards] = await network.getBoards();
        if (result === HttpStatusCodes.Ok) {
            return this.page.render(boards);
        }
        router.go(Urls.Login);
    }
}
