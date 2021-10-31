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

        this._showCreateBoardModalCallBack = this._showCreateBoardModal.bind(this);
        this._hideCreateBoardModalCallBack = this._hideCreateBoardModal.bind(this);
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
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
        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
        this._addListenersCreateBoardModal();
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
        this._removeListenersCreateBoardModal();
    }

    /**
     * Метод, добавляющий обработчики формы создания доски
     * @private
     */
    _addListenersCreateBoardModal() {
        document.querySelectorAll('.add-board')?.forEach((item) => {
            item.addEventListener('click', this._showCreateBoardModalCallBack);
        });
        this.closeModalButton = document.getElementById('close-modal');
        this.closeModalButton?.addEventListener('click', this._hideCreateBoardModalCallBack);
        window.addEventListener('click', this._hideCreateBoardModalCallBack);
    }

    /**
     * Метод, удаляющий обработчики формы создания доски
     * @private
     */
    _removeListenersCreateBoardModal() {
        document.querySelectorAll('.add-board')?.forEach((item) => {
            item.removeEventListener('click', this._showCreateBoardModalCallBack);
        });
        window.removeEventListener('click', this._hideCreateBoardModalCallBack);
    }

    /**
     * Делает видимым модальное окно создания доски
     * @private
     */
    _showCreateBoardModal() {
        this.createBoardModal = document.getElementById('create-board-modal-wrapper');
        this.createBoardModal.style.display = 'block';
    }

    /**
     * Скрывает модальное окно создания доски
     * @param {Event} event - оюъект собыбия клика
     * @private
     */
    _hideCreateBoardModal(event) {
        if (event.target !== this.createBoardModal && event.target !== this.closeModalButton) {
            return;
        }
        this.createBoardModal.style.display = 'none';
    }
}
