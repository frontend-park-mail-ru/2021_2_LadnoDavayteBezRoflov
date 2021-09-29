'use strict';

// utils
import {registerPartials} from './utils/Partials/partials.js';
import {Html, Urls} from './utils/constants.js';
import router from './utils/Router/Router.js';
import userStatus from './utils/UserStatus/UserStatus.js';

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

    registerPartials();

    /* Регистрация контроллеров для роутера */
    router.registerUrl(Urls.Root, new RegisterController(root)); // placeholder
    router.registerUrl(Urls.Register, new RegisterController(root));
    router.registerUrl(Urls.Logout, new LogoutController());
    router.registerUrl(Urls.Login, new LoginController(root));
    router.registerUrl(Urls.Boards, new BoardsController(root));

    try {
        router.route();
    } catch (error) {
    // TODO - красивый вывод
        console.error(error);
    }
});
