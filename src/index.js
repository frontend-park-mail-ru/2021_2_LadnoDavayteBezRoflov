'use strict';

import {userActions} from './actions/user.js';

// Stores
import UserStore from './stores/UserStore/UserStore.js';

// Modules
import Router from './modules/Router/Router.js';

// utils
import {Html, Urls} from './constants/constants.js';

// Файл стилей
import './styles/scss/Common.scss';

// Views
import RegisterView from './views/RegisterView/RegisterView.js';
import LoginView from './views/LoginView/LoginView.js';
import BoardsView from './views/BoardsView/BoardsView.js';
import BoardView from './views/BoardView/BoardView.js';
import CardComponent from './components/Card/Card.js';
import ProfileView from './views/ProfileView/ProfileView.js';

debugger;
/* if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered with scope ', registration.scope);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
} */

if (UserStore.getContext('isAuthorized') === undefined) {
    userActions.fetchUser();
}

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);

    UserStore.addListener(() => {
        if (UserStore.getContext('isAuthorized') !== undefined) {
            try {
                Router.register(Urls.Root, new BoardsView(root));
                Router.register(Urls.Register, new RegisterView(root));
                Router.register(Urls.Login, new LoginView(root));
                Router.register(Urls.Card, new CardComponent());
                Router.register(Urls.Boards, new BoardsView(root));
                Router.register(Urls.Board, new BoardView(root));
                Router.register(Urls.Profile, new ProfileView(root));
                Router.start();
            } catch (error) {
                console.error(error);
            }
        }
    });
});
