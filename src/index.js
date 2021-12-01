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
import './styles/scss/ViewElements.scss';

// Views
import RegisterView from './views/RegisterView/RegisterView.js';
import LoginView from './views/LoginView/LoginView.js';
import BoardsView from './views/BoardsView/BoardsView.js';
import BoardView from './views/BoardView/BoardView.js';
import ProfileView from './views/ProfileView/ProfileView.js';
import {settingsActions} from './actions/settings';

if ('serviceWorker' in navigator && !DEBUG) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('SW registered with scope ', registration.scope);
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

if (UserStore.getContext('isAuthorized') === undefined) {
    userActions.fetchUser();
}

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);
    document.getElementById('no-connection').innerHTML = '';

    const boardView = new BoardsView(root);
    Router.register(Urls.Root, boardView);
    Router.register(Urls.Boards, boardView);
    Router.register(Urls.Register, new RegisterView(root));
    Router.register(Urls.Login, new LoginView(root));
    Router.register(Urls.Board, new BoardView(root));
    Router.register(Urls.Profile, new ProfileView(root));

    UserStore.addListener(() => {
        if (UserStore.getContext('isAuthorized') === undefined) {
            return;
        }

        try {
            settingsActions.getSettings(UserStore.getContext('userName'));
            Router.start();
        } catch (error) {
            console.error(error);
        }
    });
});

window.addEventListener('resize', (() => {
    /* Callback на ресайз будет срабатывать раз в 200 мс,
     * т.к. иначе слишком часто будет вызываться при движении
     * "рамки" браузера */
    let resizeTimeout = null;
    return () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                settingsActions.windowResized(window.innerWidth, window.innerHeight);
            }, 100);
        }
    };
})(), false);
