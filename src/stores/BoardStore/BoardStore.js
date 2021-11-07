import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';
import {CardActionTypes} from '../../actions/card.js';
import {BoardActionTypes} from '../../actions/board';

/**
 * Класс, реализующий хранилище доски
 */
class BoardStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('Board');
        this._storage.set('setting-popup', {
            visible: false,
        });
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case BoardsActionTypes.BOARD_GET:
            await this._get(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_CREATE:
            await this._createCard(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_UPDATE:
            await this._updateCard(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_DELETE:
            await this._deleteCard(action.data);
            this._emitChange();
            break;

        case BoardActionTypes.POPUP_BOARD_SHOW:
            this._showSetting();
            this._emitChange();
            break;

        case BoardActionTypes.POPUP_BOARD_HIDE:
            this._hideSettings();
            this._emitChange();
            break;

        case BoardActionTypes.POPUP_BOARD_UPDATE:
            await this._updateTitleAndDescription(action.data);
            this._emitChange();
            break;

        default:
            return;
        }
    }

    /**
     * Метод, возвращающий карточку по ее айди.
     * @param {Int} cid айди карточки
     * @return {Object} данные карточки
     */
    getCardByCID(cid) {
        let cardByCID;
        (Object.values(this.getContext('content'))
            .filter((cardlist) => {
                (Object.values(cardlist.cards)
                    .filter((card) => {
                        if (card.cid === cid) {
                            cardByCID = card;
                        }
                    }));
            },
            )
        );
        return cardByCID;
    }

    /**
     * Метод, возвращающий доску по CID.
     * @param {int} CID
     * @return {int} значение поля
     */
    getBoardByCID(CID) {
        return this.getContext('content')[CID].bid;
    }

    /**
     * Возвращает контекст для boardSettingPopUp
     * @return {Object} контекст
     */
    getSettingPopUpContext() {
        return {
            ...this._storage.get('setting-popup'),
            title: 'some board',
            description: 'board description',
        };
    }

    /**
     * Метод, реализующий реакцию на запрос создания карточки.
     * @param {Object} data полезная нагрузка запроса
     */
    async _createCard(data) {
        // TODO validation

        let payload;

        try {
            payload = await Network.createCard(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на запрос обновления карточки.
     * @param {Object} data полезная нагрузка запроса
     */
    async _updateCard(data) {
        // TODO validation

        let payload;

        try {
            payload = await Network.updateCard(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на запрос удаления карточки.
     * @param {Object} data полезная нагрузка запроса
     */
    async _deleteCard(data) {
        let payload;

        try {
            payload = await Network.deleteCard(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Метод, реализующий реакцию на запрос доски с id.
     * @param {Object} data полезная нагрузка запроса
     */
    async _get(data) {
        let payload;

        try {
            payload = await Network.getBoard(data.id);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.set('id', response.data.id);
            this._storage.set('title', response.data.title);
            this._storage.set('team', response.data.team);
            this._storage.set('description', response.data.description);
            this._storage.set('content', response.data.content);
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    _showSetting() {
        console.log('_showSetting');
        this._storage.get('setting-popup').visible = true;
    }

    _hideSettings() {
        console.log('_hideSettings');
        this._storage.get('setting-popup').visible = false;
    }

    async _updateTitleAndDescription(data) {
        this._storage.get('setting-popup').visible = false;
        console.log('_updateTitleAndDescription');
        // Поход в сеть
    }
}

export default new BoardStore();
