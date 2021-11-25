// Базовая страница
import BaseView from '../BaseView.js';

import Router from '../../modules/Router/Router.js';

// Сторы
import UserStore from '../../stores/UserStore/UserStore.js';
import BoardsStore from '../../stores/BoardsStore/BoardsStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

import {Urls} from '../../constants/constants.js';
import {boardsActions} from '../../actions/boards.js';

// Стили
import './BoardsView.scss';

// Шаблон
import template from './BoardsView.hbs';
import CreateBoardPopUp from '../../popups/CreateBoard/CreateBoardPopUp.js';
import AddUserPopUp from '../../popups/AddUser/AddUserPopUp';


/**
 * Класс, реализующий страницу с досками.
 */
export default class BoardsView extends BaseView {
    /**
     * Конструктор, создающий конструктор базовой страницы с нужными параметрами
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        const context = new Map([...UserStore.getContext(), ...SettingsStore.getContext()]);
        super(context, template, parent);

        this._elements = {};
        this._bindCallBacks();

        UserStore.addListener(this._onRefresh);
        BoardsStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);

        this.addComponent('CreateBoardPopUp', new CreateBoardPopUp());
        this.addComponent('AddTeamMemberPopUp', new AddUserPopUp(this._addUserCallBacks));
        this._setContextByComponentName('AddTeamMemberPopUp',
                                        BoardsStore.getContext('add-team-member-popup'));
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this._setContext(new Map([
            ...UserStore.getContext(),
            ...BoardsStore.getContext(),
            ...SettingsStore.getContext()],
        ));

        this._setContextByComponentName('AddTeamMemberPopUp',
                                        BoardsStore.getContext('add-team-member-popup'));

        if (!this._isActive) {
            return;
        }

        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }

        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this._setContext(new Map([
            ...UserStore.getContext(),
            ...BoardsStore.getContext(),
            ...SettingsStore.getContext(),
        ]));

        this._setContextByComponentName('AddTeamMemberPopUp',
                                        BoardsStore.getContext('add-team-member-popup'));

        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }

        boardsActions.getBoards();

        this.render();
        this._isActive = true;
    }

    /**
     * Метод, отрисовывающий страницу.
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
        this._elements.addBoardBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowCreateBoardPopUp);
        });
        this._elements.inviteMembersBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowAddTeamMemberPopUp);
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.addBoardBtns?.forEach((item) => {
            item.removeEventListener('click', this._onShowCreateBoardPopUp);
        });
        this._elements.inviteMembersBtns?.forEach((item) => {
            item.removeEventListener('click', this._onShowAddTeamMemberPopUp);
        });
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._onRefresh = this._onRefresh.bind(this);
        this._onShowCreateBoardPopUp = this._onShowCreateBoardPopUp.bind(this);
        this._onShowAddTeamMemberPopUp = this._onShowAddTeamMemberPopUp.bind(this);
        this._addUserCallBacks = {
            onInput: this._onAddTeamMemberInput.bind(this),
            onUserClick: this._onAddTeamMemberUserClick.bind(this),
            onClose: this._onAddTeamMemberClose.bind(this),
        };
    }

    /**
     * Метод сохраняет элементы DOM связанные с формой создания доски
     * @private
     */
    _registerElements() {
        this._elements = {
            addBoardBtns: document.querySelectorAll('.add-board'),
            inviteMembersBtns: document.querySelectorAll('.invite-board'),
        };
    }

    /**
     * Делает видимым модальное окно создания доски
     * @param {Object} event
     * @private
     */
    _onShowCreateBoardPopUp(event) {
        boardsActions.showModal(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Callback вызывается при вводе текста в input поиска AddTeamMemberPopUp
     * @param {Event} event объект события
     * @private
     */
    _onAddTeamMemberInput(event) {
        boardsActions.refreshTeamSearchList(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатие на строку с пользователем в AddTeamMemberPopUp
     * @param {Event} event - объект события
     * @private
     */
    _onAddTeamMemberUserClick(event) {
        const user = event.target.closest('div.search-result');
        boardsActions.toggleUserInSearchList(parseInt(user.dataset.uid, 10));
    }

    /**
     * Callback, вызываемый при нажатии на значек приглашения в команду
     * @param {Event} event - объект события
     * @private
     */
    _onShowAddTeamMemberPopUp(event) {
        event.preventDefault();
        boardsActions.showAddTeamMemberPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Callback, вызываемый при закрытии AddTeamMemberPopUp
     * @param {Event} event объект события
     * @private
     */
    _onAddTeamMemberClose(event) {
        if (event.target.id === 'addUserPopUpCloseId' ||
            event.target.id === 'addUserPopUpWrapperId') {
            boardsActions.hideAddTeamMemberPopUp();
        }
    }
}
