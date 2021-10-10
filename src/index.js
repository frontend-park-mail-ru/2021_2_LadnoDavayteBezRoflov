'use strict';

// utils
import {Html, Urls} from './utils/constants.js';
import router from './utils/Router/Router.js';
import userStatus from './utils/UserStatus/UserStatus.js';

// Скомпилированные шаблон Handlebars
import '/src/tmpl.js';

// Контроллеры
import RegisterController from './controllers/RegisterController/RegisterController.js';
import LoginController from './controllers/LoginController/LoginController.js';
import BoardsController from './controllers/BoardsController/BoardsController.js';
import LogoutController from './controllers/LogoutController/LogoutController.js';

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);

    /* Сверка требуемого состояния пользователя с состоянием на сервере */
    if (!userStatus.getAuthorized() && userStatus.getUserName() === undefined) {
        await userStatus.init();
    }

    /* Регистрация контроллеров для роутера */
    router.register(Urls.Root, new RegisterController(root)); // placeholder
    router.register(Urls.Register, new RegisterController(root));
    router.register(Urls.Logout, new LogoutController());
    router.register(Urls.Login, new LoginController(root));
    router.register(Urls.Boards, new BoardsController(root));

    try {
        router.start();
    } catch (error) {
    // TODO - красивый вывод
        console.error(error);
    }
});
