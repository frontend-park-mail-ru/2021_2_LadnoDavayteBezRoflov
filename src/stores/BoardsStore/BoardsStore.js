import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';

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

        this._storage.set('teams', undefined);
    }

    /**
     * Метод, возвращающий текущее состояние (контекст) хранилища.
     * @param {String | undefined} field возвращаемое поле
     * @return {String} контекст хранилища
     */
    getContext(field) {
        return (field === undefined)? this._storage : this._storage.get(field);
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
}

export default new BoardsStore();
