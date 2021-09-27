'use strict';

// Интерфейс контроллера
import ControllerInterface from '../baseController.js';

// Страница входа
import LoginPage from '../../pages/login/login.js';

/**
 * Класс, реализующий контроллер для страницы входа.
 */
export default class LoginController extends ControllerInterface {
    
    constructor(parent) {
        super();
        this.page = new LoginPage(parent);
    }

    work(body) {
        return this.page.render(body);
    }
}
