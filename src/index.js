'use strict';

// utils
import {registerPartials} from './utils/Partials/partials.js';
import {html, urls} from './utils/constants.js';
import router from './utils/Router/Router.js';
import userStatus from './utils/UserStatus/UserStatus.js';

// controllers
import RegisterController from './controllers/RegisterController/RegisterController.js';
import LoginController from './controllers/LoginController/LoginController.js';
import BoardsController from './controllers/BoardsController/BoardsController.js';
import LogoutController from './controllers/LogoutController/LogoutController.js';

/* Обработчик на загрузку страницы */ 
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(html.root);

    /* Сверка требуемого состояния пользователя с состоянием на сервере */
    if (!userStatus.getAuthorized() && userStatus.getUserName() === undefined) {
        await userStatus.init();
    }

    /* Регистрация частичных компонентов Handlebars */
    registerPartials();

    /* Регистрация контроллерок для роутера */ 
    router.registerUrl(urls.root, new RegisterController(root)); // placeholder
    router.registerUrl(urls.register, new RegisterController(root));
    router.registerUrl(urls.logout, new LogoutController()); 
    router.registerUrl(urls.login, new LoginController(root));
    router.registerUrl(urls.boards, new BoardsController(root));

    try {
        router.route();
    } catch (error) {
        // TODO - красивый вывод
        console.error(error);
    }
});
