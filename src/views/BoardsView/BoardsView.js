'use strict';

// Базовая страница
import BaseView from '../BaseView.js';

import Router from '../../modules/Router/Router.js';

import UserStore from '../../stores/UserStore/UserStore.js';

import {Urls} from '../../constants/constants.js';

/**
  * Класс, реализующий страницу с досками.
  */
export default class BoardsView extends BaseView {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        const context = UserStore.getContext();
        super(context, Handlebars.templates['views/BoardsView/BoardsView'], parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.context = UserStore.getContext();

        if (!this.context.isAuthorized) {
            Router.go(Urls.Login);
            return;
        }

        this._setContext(this.context);
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {

    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {

    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render(context) {
    /* Если пользователь не авторизован, то перебросить его на вход */
        if (!this.context.isAuthorized) {
            Router.go(Urls.Login);
            return;
        }

        const data = this.prepareBoards(context);

        super.render(data);

        this.addEventListeners();
    }

    /**
  * Метод, добавляющий обработчики событий для страницы.
  */
    addEventListeners() {
        // placeholder
    }

    /**
  * Метод, удаляющий обработчики событий для страницы.
  */
    removeEventListeners() {
        // placeholder
        // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
    }

    /**
  * Метод, подготоваливающий данные о досках к отрисовке.
  * @param {json} context полученное от бэкенда сообщение
  * @return {json} готовые к отрисовке данные
  */
    prepareBoards(context) {
        const data = {teams: {}};
        data.teams = {...context};
        return data;
    }
}
