'use strict';

import actions from '../actions/actions.js';
import UserStore from '../stores/UserStore/UserStore.js';

import Router from '../modules/Router/Router.js';
import BaseView from './BaseView.js';
import {Urls} from '../constants/constants.js';

/**
 * Класс, реализующий технический "view" для страницы выхода
 */
export default class LogoutView extends BaseView {
    /**
     * @constructor
     */
    constructor() {
        super(null, null, parent);
    }

    /**
     * Метод, выполняющий логику выхода
     */
    render() {
        if (!(UserStore.getContext().isAuthorized)) {
            Router.go(Urls.Login);
            return;
        }

        actions.logout();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {

    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {

    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {

    }
}
