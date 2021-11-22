import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {BoardStoreConstants, ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';
import Validator from '../../modules/Validator/Validator';

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

        const team = this._storage.get('teams').find((team) => {
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
            team.users = members;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }
}

export default new BoardsStore();
