'use strict';

import {userActions} from './actions/user.js';

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
import BoardsView from './views/BoardsView/BoardsView.js';
import CardComponent from './components/Card/Card.js';
import BoardView from './views/BoardView/BoardView.js';
import CardListComponent from './components/CardList/CardList.js';

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);

    /* Сверка требуемого состояния пользователя с состоянием на сервере */
    if (UserStore.getContext('isAuthorized') === undefined) {
        userActions.fetchUser();
    }

    //Handlebars.registerPartial('Cardlist', new CardListComponent().template);
    //Handlebars.registerPartial('Card', new CardComponent().template);

    try {
        Router.register(Urls.Root, new BoardsView(root));
        Router.register(Urls.Register, new RegisterView(root));
        Router.register(Urls.Login, new LoginView(root));
        Router.register(Urls.Card, new CardComponent());
        Router.register(Urls.Boards, new BoardsView(root));
        Router.register(Urls.Board, new BoardView(root));

        Router.start();
    } catch (error) {
        console.error(error);
    }
});
