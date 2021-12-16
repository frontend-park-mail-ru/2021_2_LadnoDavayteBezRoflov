// Базовая страница
import BaseView from '../BaseView.js';
import {Urls} from '../../constants/constants.js';
import Router from '../../modules/Router/Router.js';

// Сторы
import UserStore from '../../stores/UserStore/UserStore.js';
import BoardsStore from '../../stores/BoardsStore/BoardsStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';


// Actions
import {boardsActions} from '../../actions/boards.js';
import {teamsActions} from '../../actions/teams';

// Стили
import './BoardsView.scss';

// Шаблон
import template from './BoardsView.hbs';

// PopUp
import CreateBoardPopUp from '../../popups/CreateBoard/CreateBoardPopUp.js';
import AddUserPopUp from '../../popups/AddUser/AddUserPopUp.js';
import DeleteDialogPopUp from '../../popups/DeleteDialog/DeleteDialogPopUp.js';
import CreateTeamPopUp from '../../popups/CreateTeam/CreateTeamPopUp';

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
        this.addComponent('TeamPopUp', new CreateTeamPopUp());
        this.addComponent('DeleteTeam', new DeleteDialogPopUp(this._deleteTeamCallBacks));
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
     * @private
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
        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        this._registerElements();
        this._elements.addBoardBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowCreateBoardPopUp);
        });
        this._elements.inviteMembersBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowAddTeamMemberPopUp);
        });

        this._elements.createTeamBtn?.addEventListener('click', this._onShowCreateTeamPopUp);
        this._elements.editTeamBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowEditTeamPopUp);
        });
        this._elements.deleteTeamBtns?.forEach((item) => {
            item.addEventListener('click', this._onShowDeleteTeamPopUp);
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
        this._elements.createTeamBtn?.removeEventListener('click', this._onShowCreateTeamPopUp);
        this._elements.editTeamBtns?.forEach((item) => {
            item.removeEventListener('click', this._onShowEditTeamPopUp);
        });
        this._elements.deleteTeamBtns?.forEach((item) => {
            item.removeEventListener('click', this._onShowDeleteTeamPopUp);
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
        this._deleteTeamCallBacks = {
            onClose: this._onDeleteTeamPopUpClose.bind(this),
            onConfirm: this._onDeleteTeamConfirm.bind(this),
            onReject: this._onDeleteTeamReject.bind(this),
        };

        this._onShowDeleteTeamPopUp = this._onShowDeleteTeamPopUp.bind(this);
        this._onShowEditTeamPopUp = this._onShowEditTeamPopUp.bind(this);
        this._onShowCreateTeamPopUp = this._onShowCreateTeamPopUp.bind(this);
    }

    /**
     * Метод сохраняет элементы DOM связанные с формой создания доски
     * @private
     */
    _registerElements() {
        this._elements = {
            addBoardBtns: document.querySelectorAll('.add-board-btn'),
            inviteMembersBtns: document.querySelectorAll('.invite-board'),
            createTeamBtn: document.getElementById('createTeamBtnId'),
            deleteTeamBtns: document.querySelectorAll('.team-delete-btn'),
            editTeamBtns: document.querySelectorAll('.team-edit-btn'),
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

    /* Удаление команды: */
    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    _onDeleteTeamPopUpClose(event) {
        if (event.target.id === 'deletePopUpWrapperId' ||
            event.target.id === 'deletePopUpCloseId') {
            teamsActions.hideDeleteTeamPopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Удалить"
     * @param {Event} event объект события
     * @private
     */
    _onDeleteTeamConfirm(event) {
        event.preventDefault();
        teamsActions.deleteTeam(true);
    }

    /**
     * Callback, вызываемый при нажатии "Не удалять"
     * @param {Event} event объект события
     * @private
     */
    _onDeleteTeamReject(event) {
        event.preventDefault();
        teamsActions.deleteTeam(false);
    }

    /**
     * Callback, вызываемый при нажатии "уалить команду"
     * @param {Event} event объект события
     * @private
     */
    _onShowDeleteTeamPopUp(event) {
        event.preventDefault();
        teamsActions.showDeleteTeamPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Callback, вызываемый при нажатии "редактировать команду"
     * @param {Event} event объект события
     * @private
     */
    _onShowEditTeamPopUp(event) {
        event.preventDefault();
        teamsActions.showEditTeamPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Callback, вызываемый при нажатии "создать команду"
     * @param {Event} event объект события
     * @private
     */
    _onShowCreateTeamPopUp(event) {
        event.preventDefault();
        teamsActions.showAddTeamPopUp();
    }
}
