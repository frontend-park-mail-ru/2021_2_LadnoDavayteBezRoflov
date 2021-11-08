import BaseStore from '../BaseStore.js';
import {BoardsActionTypes} from '../../actions/boards.js';

import Network from '../../modules/Network/Network.js';
import {ConstantMessages, HttpStatusCodes} from '../../constants/constants.js';
import UserStore from '../UserStore/UserStore.js';
import {CardActionTypes} from '../../actions/card.js';
import {BoardActionTypes} from '../../actions/board';
import Router from '../../modules/Router/Router';
import Validator from '../../modules/Validator/Validator';
import {CardListActionTypes} from '../../actions/cardlist';

/**
 * Класс, реализующий хранилище доски
 */
class BoardStore extends BaseStore {
    /**
     * @constructor
     */
    constructor() {
        super('Board');
        this._storage.set('card_lists', []);
        this._storage.set('setting-popup', {
            visible: false,
            board_name: null,
            description: null,
            errors: null,
            confirm: false,
        });

        this._storage.set('cardlist-popup', {
            visible: false,
            edit: false,
            cid: null,
            position: null,
            positionRange: null,
            cardList_name: null,
            errors: null,
        });

        this._storage.set('delete-cl-popup', {
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

        /* Board Settings*/
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

        case BoardActionTypes.POPUP_BOARD_DELETE_SHOW:
            this._showConfirmDialog();
            this._emitChange();
            break;

        case BoardActionTypes.POPUP_BOARD_DELETE_HIDE:
            await this._processHideConfirmDialog(action.data);
            this._emitChange();
            break;

        /* Card List */
        case CardListActionTypes.CARD_LIST_CREATE_SHOW:
            break;

        case CardListActionTypes.CARD_LIST_EDIT_SHOW:
            break;

        case CardListActionTypes.CARD_LIST_HIDE:
            break;

        case CardListActionTypes.CARD_LIST_UPDATE_SUBMIT:
            break;

        case CardListActionTypes.CARD_LIST_CREATE_SUBMIT:
            break;

        case CardListActionTypes.CARD_LIST_DELETE_SHOW:
            break;

        case CardListActionTypes.CARD_LIST_DELETE_CHOOSE:
            break;

        case CardListActionTypes.CARD_LIST_DELETE_HIDE:
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
        (Object.values(this.getContext('card_lists'))
            ?.filter((cardlist) => {
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
            board_name: this._storage.get('board_name'),
            description: this._storage.get('description'),
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
            this._storage.set('bid', payload.data.bid);
            this._storage.set('tid', payload.data.tid);
            this._storage.set('board_name', payload.data.board_name);
            this._storage.set('description', payload.data.description);
            this._storage.set('card_lists', payload.data.card_lists);
            return;

        case HttpStatusCodes.Unauthorized:
            UserStore.__logout();
            return;

        default:
            console.log('Undefined error');
        }
    }

    /**
     * Установить окно настроект видимым
     * @private
     */
    _showSetting() {
        this._storage.get('setting-popup').errors = null;
        this._storage.get('setting-popup').visible = true;
    }

    /**
     * Установить окно настроект не видимым
     * @private
     */
    _hideSettings() {
        this._storage.get('setting-popup').errors = null;
        this._storage.get('setting-popup').visible = false;
        this._storage.get('setting-popup').confirm = false;
    }

    /**
     * Обновить информацию о доске
     * @param {Object} data новые данные
     * @return {Promise<void>}
     * @private
     */
    async _updateTitleAndDescription(data) {
        this._storage.get('setting-popup').errors = null;
        const validator = new Validator();

        this._storage.get('setting-popup').errors = validator.validateBoardDescription(data.description);
        if (this._storage.get('setting-popup').errors) {
            return;
        }

        this._storage.get('setting-popup').errors = validator.validateBoardTitle(data.board_name);
        if (this._storage.get('setting-popup').errors) {
            return;
        }

        let payload;

        try {
            payload = await Network.updateBoard(data, this._storage.get('bid'));
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error); // TODO pretty
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._hideSettings();
            this._storage.set('board_name', payload.data.board_name);
            this._storage.set('description', payload.data.description);
            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('setting-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('setting-popup').errors = ConstantMessages.BoardUpdateErrorOnServer;
            return;
        }
    }

    /**
     * Отобразить диалог подтверждения удаления доски
     * @private
     */
    _showConfirmDialog() {
        this._storage.get('setting-popup').errors = null;
        this._storage.get('setting-popup').confirm = true;
    }

    /**
     * Обработать закрытие диалога подтверждения удаления
     * @param {Object} data - результат диалога
     * @return {Promise<void>}
     * @private
     */
    async _processHideConfirmDialog(data) {
        this._storage.get('setting-popup').errors = null;
        this._storage.get('setting-popup').confirm = false;
        if (!data.confirmed) {
            return;
        }

        let payload;

        try {
            payload = await Network.deleteBoard(this._storage.get('bid'));
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            Router.go('/boards');
            this._storage.get('setting-popup').visible = false;
            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('setting-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('setting-popup').errors = ConstantMessages.BoardDeleteErrorOnServer;
            return;
        }
    }
}

export default new BoardStore();
