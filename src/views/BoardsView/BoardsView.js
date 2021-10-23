// Базовая страница
import BaseView from '../BaseView.js';

import Router from '../../modules/Router/Router.js';

import UserStore from '../../stores/UserStore/UserStore.js';
import BoardsStore from '../../stores/BoardsStore/BoardsStore.js';

import {Urls} from '../../constants/constants.js';
import actions from '../../actions/actions.js';

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

        // UserStore.addListener(this._onRefresh);
        BoardsStore.addListener(this._onRefresh);
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        // if (!this.context.get('isAuthorized')) {
        //    Router.go(Urls.Login);
        //    return;
        // }


        this.context = new Map([...UserStore.getContext()].concat([...BoardsStore.getContext()]));

        this._setContext(this.context);
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     * @param {Object|null} urlData параметры, переданные командной строкой
     */
    _onShow(urlData) {
        this._urlParams = urlData;

        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login);
            return;
        }

        actions.getBoards();

        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {
        try {
            this.removeEventListeners();
        } catch (error) {

        }
    }

    /**
   * Метод, отрисовывающий страницу.
   * @param {object} context контекст отрисовки страницы
   */
    render() {
        super.render(this.context);
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
}
