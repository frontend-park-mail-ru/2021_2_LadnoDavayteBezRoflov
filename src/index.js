'use strict';

import actions from './actions/actions.js';

// Stores
import UserStore from './stores/UserStore/UserStore.js';

// Modules
import Router from './modules/Router/Router.js';

// utils
import {Html, Urls} from './constants/constants.js';

// Скомпилированные шаблоны Handlebars
import '/src/tmpl.js';

// Views
import RegisterView from './views/RegisterView/RegisterView.js';
import LoginView from './views/LoginView/LoginView.js';
import LogoutView from './views/LogoutView.js';
import BoardsView from './views/BoardsView/BoardsView.js';

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);

    /* Сверка требуемого состояния пользователя с состоянием на сервере */
    const context = UserStore.getContext();
    if (!context.isAuthorized && context.userName === undefined) {
        actions.init();
    }

    try {
        Router.register(Urls.Root, new RegisterView(root));
        Router.register(Urls.Register, new RegisterView(root));
        Router.register(Urls.Login, new LoginView(root));
        Router.register(Urls.Logout, new LogoutView());
        Router.register(Urls.Boards, new BoardsView(root));

        Router.start();
    } catch (error) {
        console.error(error);
    }
});
