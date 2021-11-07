// Базовая страница
import BaseView from '../BaseView.js';

import Router from '../../modules/Router/Router.js';

import UserStore from '../../stores/UserStore/UserStore.js';
import BoardsStore from '../../stores/BoardsStore/BoardsStore.js';

import {Urls} from '../../constants/constants.js';
import {boardsActions} from '../../actions/boards.js';

// Стили
import './BoardsView.scss';

// Шаблон
import template from './BoardsView.hbs';

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
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);

        UserStore.addListener(this._onRefresh);
        BoardsStore.addListener(this._onRefresh);

        this._bindCallBacks();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this._setContext(new Map([...UserStore.getContext(), ...BoardsStore.getContext()]));

        if (!this._isActive) {
            return;
        }

        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login);
            return;
        }

        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this._setContext(new Map([...UserStore.getContext(), ...BoardsStore.getContext()]));

        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login);
            return;
        }

        boardsActions.getBoards();

        this.render();
        this._isActive = true;
    }

    /**
     * Метод, отрисовывающий страницу.
     * @param {object} context контекст отрисовки страницы
     */
    render() {
        super.render();
        this._registerElements();
        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        this._addBoardBtns?.forEach((item) => {
            item.addEventListener('click', this._showCreateBoardModal);
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._addBoardBtns?.forEach((item) => {
            item.removeEventListener('click', this._showCreateBoardModal);
        });
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._showCreateBoardModal = this._showCreateBoardModal.bind(this);
    }

    /**
     * Метод сохраняет элементы DOM связанные с формой создания доски
     * @private
     */
    _registerElements() {
        this._addBoardBtns = document.querySelectorAll('.add-board');
    }

    /**
     * Делает видимым модальное окно создания доски
     * @param {Object} event
     * @private
     */
    _showCreateBoardModal(event) {
        this.teamID = event.target.dataset.id;
        boardsActions.showModal(this.teamID);
    }
}
