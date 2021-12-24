'use strict';
import {userActions} from './actions/user';

// Stores
import UserStore from './stores/UserStore/UserStore';

// Modules
import Router from './modules/Router/Router';

// utils
import {Html, Urls} from './constants/constants';

// Файл стилей
import './styles/scss/Common.scss';
import './styles/scss/ViewElements.scss';

// Views
import RegisterView from './views/RegisterView/RegisterView';
import LoginView from './views/LoginView/LoginView';
import BoardsView from './views/BoardsView/BoardsView';
import BoardView from './views/BoardView/BoardView';
import ProfileView from './views/ProfileView/ProfileView';
import {settingsActions} from './actions/settings';
import ServiceWorkerClient from './modules/ServiceWorkerClient/ServiceWorkerClient';
import OfflineView from './views/OfflineView/OfflineView';
import NotFoundView from './views/NotFoundView/NotFoundView';

if (UserStore.getContext('isAuthorized') === undefined) {
    userActions.fetchUser();
}

/* Обработчик на загрузку страницы */
window.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById(Html.Root);
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    document.getElementById('no-connection').innerHTML = '';

    const boardsView = new BoardsView(root);
    const boardView = new BoardView(root);
    Router.registerNotFound(new NotFoundView(root));
    Router.register(Urls.Root, boardsView);
    Router.register(Urls.Boards, boardsView);
    Router.register(Urls.Invite.Board, boardView);
    Router.register(Urls.Invite.Card, boardView);
    Router.register(Urls.Register, new RegisterView(root));
    Router.register(Urls.Login, new LoginView(root));
    Router.register(Urls.Board, boardView);
    Router.register(Urls.Profile, new ProfileView(root));
    Router.register(Urls.Offline, new OfflineView(root));

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
    let resizeTimeout: any = null;
    return () => {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                settingsActions.windowResized(window.innerWidth, window.innerHeight);
            }, 100);
        }
    };
})(), false);


if ('serviceWorker' in navigator) {
    // @ts-expect-error ts-migrate(6133) FIXME: 'serviceWorkerClient' is declared but its value is... Remove this comment to see the full error message
    // eslint-disable-next-line no-unused-vars
    const serviceWorkerClient = new ServiceWorkerClient(navigator.serviceWorker);
    window.addEventListener('load', async () => {
        try {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'SW_FILE_NAME'.
            await navigator.serviceWorker.register(`/${SW_FILE_NAME}`);
        } catch (error) {
            console.log(`Ошибка при регистрации SW: ${error}`);
        }
    });
}
