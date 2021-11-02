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
        this._findCreateModalElements();
        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        this.subComponents.forEach(([_, component]) => {
            component.addEventListeners();
        });
        this._addListenersCreateModal();
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        // TODO проследить, чтобы удалялись все потенциальные обработчики из компонентов
        this._removeListenersCreateModal();
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._showCreateBoardModalCallBack = this._showCreateBoardModal.bind(this);
        this._hideCreateBoardModalCallBack = this._hideCreateBoardModal.bind(this);
        this._submitCreateBoardCallBack = this._submitCreateBoard.bind(this);
    }

    /**
     * Метод сохраняет элементы DOM связанные с формой создания доски
     * @private
     */
    _findCreateModalElements() {
        this._createModal = {
            addBoardBtns: document.querySelectorAll('.add-board'),
            closeModalBtn: document.getElementById('close-modal'),
            modalWrapper: document.getElementById('create-board-modal-wrapper'),
            boardName: document.getElementById('board-name'),
            boardTeam: document.getElementById('board-team'),
            submitBtn: document.getElementById('create-submit'),
        };
    }

    /**
     * Метод, добавляющий обработчики формы создания доски
     * @private
     */
    _addListenersCreateModal() {
        this._createModal.addBoardBtns?.forEach((item) => {
            item.addEventListener('click', this._showCreateBoardModalCallBack);
        });

        this._createModal.closeModalBtn.addEventListener('click',
                                                         this._hideCreateBoardModalCallBack);
        document.addEventListener('click', this._hideCreateBoardModalCallBack);
        this._createModal.submitBtn.addEventListener('click', this._submitCreateBoardCallBack);
    }

    /**
     * Метод, удаляющий обработчики формы создания доски
     * @private
     */
    _removeListenersCreateModal() {
        this._createModal?.addBoardBtns?.forEach((item) => {
            item.removeEventListener('click', this._showCreateBoardModalCallBack);
        });
        this._createModal?.closeModalBtn.removeEventListener('click',
                                                             this._hideCreateBoardModalCallBack);
        document.removeEventListener('click', this._hideCreateBoardModalCallBack);
        this._createModal.submitBtn.removeEventListener('click', this._submitCreateBoardCallBack);
    }

    // Callbacks
    /**
     * Делает видимым модальное окно создания доски
     * @param {Object} event
     * @private
     */
    _showCreateBoardModal(event) {
        const teamID = event.target.dataset.id;
        boardsActions.showModal(teamID);
    }

    /**
     * Скрывает модальное окно создания доски
     * @param {Event} event объект события
     * @private
     */
    _hideCreateBoardModal(event) {
        if (event.target === this._createModal.closeModalBtn ||
        event.target === this._createModal.modalWrapper) {
            boardsActions.hideModal();
        }
    }

    /**
     * Обработчик события отправки формы создания доски
     * @param {Object} event
     * @private
     */
    _submitCreateBoard(event) {
        event.preventDefault();
        boardsActions.createBoard(this._createModal.boardName.value,
                                  this._createModal.boardTeam.value);
    }
}
