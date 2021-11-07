import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';
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
            teamID: null,
            errors: null,
        });
    }

    /**
     * Возвращает контекст для boardSettingPopUp
     * @return {Object} контекст
     */
    getCreateBoardPopUpContext() {
        return {
            ...this._storage.get('create-popup'),
            teams: this._storage.get('teams'),
        };
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
                tid: parseInt(data.teamID, 10),
                board_name: data.name,
            });
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        console.log('payload');
        console.log(payload);
        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const team = this._storage.get('teams').find((team) => {
                return team.tid === parseInt(data.teamID, 10);
            });

            team.boards.push({
                bid: payload.data.bid,
                board_name: data.name,
                description: '',
                tid: data.teamID,
            });

            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        case HttpStatusCodes.InternalServerError:
            this._showModal(data);
            this._storage.get('create-popup').errors = ConstantMessages.BoardErrorOnServer;
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
            teamID: null,
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
            teamID: data.teamID,
            errors: null,
        });
    }
}

export default new BoardsStore();
