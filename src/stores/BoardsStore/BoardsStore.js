import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {BoardStoreConstants, ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';
import Validator from '../../modules/Validator/Validator';
import SettingsStore from '../SettingsStore/SettingsStore';
import {TeamsActionTypes} from '../../actions/teams';

/**
 * Класс, реализующий хранилище списка команд и досок
 */
class BoardsStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('Boards');

        this._channel = 'Boards';

        this._storage = new Map();

        this._storage.set('teams', null);
        this._storage.set('create-popup', {
            visible: false,
            tid: null,
            errors: null,
        });

        this._storage.set('add-team-member-popup', {
            visible: false,
            errors: null,
            searchString: null,
            users: [],
            header: 'Добавить пользователя в команду',
        });

        this._storage.set('delete-dialog', {
            tid: null,
            name: null,
            visible: false,
        });

        this._storage.set('team-popup', {
            tid: null,
            team_name: null,
            edit: false,
            visible: false,
            errors: null,
        });
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case BoardsActionTypes.BOARDS_GET:
            await this._get();
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_CREATE:
            await this._create(action.data);
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_POPUP_HIDE:
            this._hideModal();
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_POPUP_SHOW:
            this._showModal(action.data);
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_ADD_MEMBER_SHOW:
            this._showAddTeamMemberPopUp(action.data);
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_ADD_MEMBER_CLOSE:
            this._hideAddTeamMemberPopUp();
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_ADD_MEMBER_INPUT:
            await this._refreshTeamMemberSearchList(action.data);
            this._emitChange();
            break;

        case BoardsActionTypes.BOARDS_ADD_MEMBER_USER_CLICKED:
            await this._toggleTeamMemberInSearchList(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_TEAM_HIDE:
            this._hideTeamPopUp();
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_CREATE_TEAM_SHOW:
            this._showAddTeamPopUp();
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_CREATE_TEAM_SUBMIT:
            await this._submitAddTeamPopUp(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_EDIT_TEAM_SHOW:
            this._showEditTeamPopUp(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_EDIT_TEAM_SUBMIT:
            await this._submitEditTeamPopUp(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_DELETE_TEAM_CHOOSE:
            await this._deleteTeam(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_DELETE_TEAM_SHOW:
            this._showDeleteTeamPopUp(action.data);
            this._emitChange();
            break;

        case TeamsActionTypes.POPUP_DELETE_TEAM_CLOSE:
            this._hideDeleteTeamPopUp();
            this._emitChange();
            break;

        default:
            return;
        }
    }

    /**
     * Метод, реализующий реакцию на инициализацию.
     */
    async _get() {
        let payload;

        try {
            payload = await Network.getBoards();
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:

            this._storage.set('teams', payload.data.sort(
                (first, second) => (first.id > second.id) ?
                    1 : ((second.id > first.id) ? -1 : 0)),
            );

            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, обрабатывающий запрос на создание доски
     * @todo Обработка дополнительных кодов от сервера (нет прав, например)
     * @param {Object} data - информация о новой доске
     * @return {Promise<void>}
     * @private
     */
    async _create(data) {
        const validator = new Validator();

        const validatorStatus = validator.validateBoardTitle(data.name);
        this._storage.get('create-popup').errors = validatorStatus;
        if (validatorStatus) {
            return;
        }
        this._hideModal();

        let payload;

        try {
            payload = await Network.createBoard({
                tid: data.tid,
                board_name: data.name,
            });
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const team = this._storage.get('teams').find((team) => {
                return team.tid === data.tid;
            });

            team.boards.push({
                bid: payload.data.bid,
                board_name: data.name,
                description: '',
                tid: data.tid,
            });

            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        case HttpStatusCodes.InternalServerError:
            this._showModal(data);
            this._storage.get('create-popup').errors = ConstantMessages.BoardCreateErrorOnServer;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Устанавливает состояние скрытого модального окна
     * @private
     */
    _hideModal() {
        this._storage.set('create-popup', {
            visible: false,
            tid: null,
            errors: null,
        });
    }

    /**
     * Устанавливает состояние видимого модального окна
     * @param {Object} data
     * @private
     */
    _showModal(data) {
        this._storage.set('create-popup', {
            visible: true,
            tid: data.tid,
            errors: null,
        });
    }

    /**
     * Метод включает popup добавления опльзователя в команду и устанавливает контекст
     * @param {Object} data - объект с полем tid
     * @private
     */
    _showAddTeamMemberPopUp(data) {
        const context = this._storage.get('add-team-member-popup');
        context.visible = true;
        context.tid = data.tid;
        context.errors = null;
        context.searchString = null;
        context.users = this._storage.get('teams').find((team) => {
            return team.tid === data.tid;
        }).users?.map((member) => {
            return {...member, userName: member.login || member.userName, added: true};
        });
    }

    /**
     * Метод скрывает popup добавления пользователя в команду
     * @private
     */
    _hideAddTeamMemberPopUp() {
        this._storage.get('add-team-member-popup').visible = false;
    }

    /**
     * Метод добавляет/исключает пользователя из доски
     * @param {Object} data - объект с uid пользователя
     * @private
     */
    async _refreshTeamMemberSearchList(data) {
        const context = this._storage.get('add-team-member-popup');
        context.errors = null;
        const {searchString} = data;
        context.searchString = searchString;

        if (searchString.length < BoardStoreConstants.MinUserNameSearchLength) {
            context.users = this._storage.get('teams').find((team) => {
                return team.tid === context.tid;
            }).users?.map((member) => {
                return {...member, userName: member.login || member.userName, added: true};
            });
            return;
        }

        const validator = new Validator();
        context.errors = validator.validateLogin(searchString);
        if (context.errors) {
            return;
        }

        let payload;

        try {
            payload = await Network.searchTeamMembers(searchString, context.tid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            context.users = payload.data;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Метод обновляет список пользователей в контексте popup'a добавления пользователя в команду
     * @param {Object} data - объект с текстом поиска
     * @private
     */
    async _toggleTeamMemberInSearchList(data) {
        const context = this._storage.get('add-team-member-popup');
        context.errors = null;

        const teams = this._storage.get('teams');
        const team = teams.find((team) => {
            return team.tid === context.tid;
        });
        const members = team.users.slice();
        // Найдем выбранного пользователя в списке членов команды
        const member = members.find((memeber) => {
            return memeber.uid === data.uid;
        });

        // Найдем выбранного пользователя в списке пользователей popup'a
        const user = context.users.find((user) => {
            return user.uid === data.uid;
        });

        // Если пользователь был в members, исключим его от туда. Иначе - добавим.
        if (member) {
            members.splice(members.indexOf(member), 1);
        } else {
            members.push({uid: user.uid, userName: user.userName, avatar: user.avatar});
        }

        let payload;

        try {
            payload = await Network.toggleTeamMember(context.tid, data.uid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            user.added = !member;
            if (user.userName === SettingsStore.getContext('login')) {
                teams.splice(teams.indexOf(team), 1);
                context.visible = false;
            } else {
                team.users = members;
            }
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Выполняет поиск команды
     * @param {Number} tid - номер команды
     * @return {Object} ссылку на объект команды из поля teams
     * @private
     */
    _getTeamById(tid) {
        const teams = this._storage.get('teams');
        return teams.find((team) => {
            return team.tid === tid;
        });
    }

    /**
     * Скрывает popup связанный с C/U команды
     * @private
     */
    _hideTeamPopUp() {
        const context = this._storage.get('team-popup');
        context.visible = false;
        context.errors = null;
        context.edit = false;
    }

    /**
     * Отображает popup создания команды
     * @private
     */
    _showAddTeamPopUp() {
        console.log('_showAddTeamPopUp');
        const context = this._storage.get('team-popup');
        context.visible = true;
        context.errors = null;
        context.edit = false;
    }

    /**
     * Создает новую команду
     * @param {Object} data - объект с именем команды
     * @return {Promise<void>}
     * @private
     */
    async _submitAddTeamPopUp(data) {
        const validator = new Validator();
        const validatorStatus = validator.validateTeamTitle(data.team_name);
        this._storage.get('team-popup').errors = validatorStatus;
        if (validatorStatus) {
            return;
        }
        this._hideTeamPopUp();

        let payload;

        try {
            payload = await Network.createTeam({
                team_name: data.team_name,
            });
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const newTeam = {
                boards: [],
                team_name: data.team_name,
                team_type: 0,
                tid: payload.data.tid,
                users: [
                    {
                        avatar: SettingsStore.getContext('avatar'),
                        login: SettingsStore.getContext('login'),
                    },
                ],
            };

            this._storage.get('teams').push(newTeam);
            return;

        case HttpStatusCodes.InternalServerError:
            this._showAddTeamPopUp();
            this._storage.get('team-popup').errors = ConstantMessages.UnsuccessfulRequest;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Отображает popup редактирования команды
     * @param {Object} data объект с tid
     * @private
     */
    _showEditTeamPopUp(data) {
        console.log(data);
        const context = this._storage.get('team-popup');
        context.visible = true;
        context.errors = null;
        context.team_name = this._getTeamById(data.tid).team_name;
        context.edit = true;
    }

    /**
     * Обновляет параметры команды
     * @param {Object} data объект с новым названием команды
     * @return {Promise<void>}
     * @private
     */
    async _submitEditTeamPopUp(data) {
        console.log('submit');
        const context = this._storage.get('team-popup');
        const validator = new Validator();
        const validatorStatus = validator.validateTeamTitle(data.team_name);
        context.errors = validatorStatus;
        if (validatorStatus) {
            return;
        }
        this._hideTeamPopUp();

        let payload;

        try {
            payload = await Network.updateTeam(context.tid, {
                team_name: data.team_name,
            });
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const team = this._getTeamById(context.tid);
            team.team_name = data.team_name;
            return;

        case HttpStatusCodes.InternalServerError:
            this._showEditTeamPopUp(context.tid);
            this._storage.get('team-popup').errors = ConstantMessages.UnsuccessfulRequest;
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Удаляет связанную с popup'ом команду
     * @param {Object} data результат диалога удаления
     * @private
     */
    async _deleteTeam(data) {
        this._hideDeleteTeamPopUp();
        if (!data.confirm) {
            return;
        }

        let payload;

        try {
            payload = await Network._deleteTeam(this._storage.get('delete-dialog').tid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('teams').splice(
                this._getTeamById(this._storage.get('delete-dialog').tid), 1);

        default:
            return;
        }
    }

    /**
     * Отображает popup удаления команды
     * @param {Object} data информация о команде
     * @private
     */
    _showDeleteTeamPopUp(data) {
        this._storage.set('delete-dialog', {
            visible: true,
            tid: data.tid,
            name: this._getTeamById(data.tid).team_name,
        });
    }

    /**
     * Скрывает popup удаления команды
     * @private
     */
    _hideDeleteTeamPopUp() {
        this._storage.get('delete-dialog').visible = false;
    }
}

export default new BoardsStore();
