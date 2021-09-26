'use strict';

// utils
import {registerPartials} from './utils/partials/partials.js'
import router from './utils/router/router.js'
import userStatus from './utils/userStatus/userStatus.js';

// controllers
import RegisterController from './controllers/register/registerController.js';
import LoginController from './controllers/login/loginController.js';
import BoardsController from './controllers/boards/BoardsController.js';
import LogoutController from './controllers/logout/logoutController.js';

/* Обработчик на загрузку страницы */ 
window.addEventListener('DOMContentLoaded', async () => {
    const body = document.getElementById('root');

    /* Сверка требуемого состояния пользователя с состоянием на сервере */
    if (!userStatus.getAuthorized() && userStatus.getUserName() === undefined) {
        await userStatus.init();
    }

    /* Регистрация частичных компонентов Handlebars */
    registerPartials();

    /* Регистрация контроллерок для роутера */ 
    router.registerUrl('/', new RegisterController(body));
    router.registerUrl('/register', new RegisterController(body));
    router.registerUrl('/logout', new LogoutController()); 
    router.registerUrl('/login', new LoginController(body));
    router.registerUrl('/boards', new BoardsController(body));

    try {
        router.route();
    } catch (error) {
        // TODO - красивый вывод
        console.error(error);
    }
});
