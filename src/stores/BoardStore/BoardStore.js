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
            clid: null,
            position: null,
            positionRange: null,
            cardList_name: null,
            errors: null,
        });

        this._storage.set('delete-cl-popup', {
            visible: false,
            clid: null,
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
            this._showCreateCardListPopUp();
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_EDIT_SHOW:
            this._showEditCardListPopUp(action.data);
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_HIDE:
            this._hideCardListPopUp();
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_UPDATE_SUBMIT:
            await this._updateCardList(action.data);
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_CREATE_SUBMIT:
            await this._createCardList(action.data);
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_DELETE_SHOW:
            this._showDeleteCardListPopUp(action.data);
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_DELETE_CHOOSE:
            await this._deleteCardList(action.data);
            this._emitChange();
            break;

        case CardListActionTypes.CARD_LIST_DELETE_HIDE:
            this._hideDeleteCardListPopUp();
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

    /**
     * Делает popup создания card list'a видимым
     * @private
     */
    _showCreateCardListPopUp() {
        this._storage.get('cardlist-popup').visible = true;
        this._storage.get('cardlist-popup').edit = false;
        this._storage.get('cardlist-popup').errors = null;
    }

    /**
     * Создает новый список
     * @param {Object} data информация о списке
     * @private
     */
    async _createCardList(data) {
        this._storage.get('cardlist-popup').errors = null;
        const validator = new Validator();

        this._storage.get('cardlist-popup').errors = validator.validateCardListTitle(data.cardList_name);
        if (this._storage.get('cardlist-popup').errors) {
            return;
        }

        data.bid = this._storage.get('bid');
        console.log(data);

        let payload;

        try {
            payload = await Network._createCard(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('cardlist-popup').visible = false;
            this._storage.get('card_lists').push({
                bid: this._storage.get('bid'),
                cardList_name: data.cardList_name,
                cards: [],
                cid: 0,
                clid: payload.data.clid,
                pos: this._storage.get('card_lists').length + 1,
            });
            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('cardlist-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('cardlist-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Скрывает popup создания/редактирования карточки
     * @private
     */
    _hideCardListPopUp() {
        this._storage.get('cardlist-popup').visible = false;
        this._storage.get('cardlist-popup').errors = null;
    }

    /**
     * Возвращает объект cardlist'a из storage
     * @param {Number} clid id cardlist
     * @return {Object} найденный объект карточки
     * @private
     */
    _getCardListById(clid) {
        return this._storage.get('card_lists').find((cardList) => {
            return cardList.clid === clid;
        });
    }

    /**
     * Показывает popup редактирования спика карточек
     * @param {Object} data информация о списке карточек (clid)
     * @private
     */
    _showEditCardListPopUp(data) {
        const cardListPopup = this._storage.get('cardlist-popup');
        cardListPopup.visible = true;
        cardListPopup.edit = true;
        cardListPopup.clid = data.clid;
        cardListPopup.errors = null;

        const cardlist = this._getCardListById(data.clid);

        cardListPopup.position = cardlist.pos;
        cardListPopup.positionRange = Array.from(
            {length: this._storage.get('card_lists').length},
            (_, index) => index + 1);
        cardListPopup.cardList_name = cardlist.cardList_name;
    }

    /**
     * Обновляет текущий card list
     * @param {Object} data новые данные списка
     * @return {Promise<void>}
     * @private
     */
    async _updateCardList(data) {
        this._storage.get('cardlist-popup').errors = null;
        const validator = new Validator();

        this._storage.get('cardlist-popup').errors = validator.validateCardListTitle(data.cardList_name);
        if (this._storage.get('cardlist-popup').errors) {
            return;
        }

        let payload;

        try {
            payload = await Network._updateCardList(data, this._storage.get('cardlist-popup').clid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('cardlist-popup').visible = false;

            console.log('До переупорялочивания');
            console.log(data);
            // Обновим позиции списков в storage

            const cardList = this._getCardListById(this._storage.get('cardlist-popup').clid);
            const bound = data.pos > cardList.pos ?
                {left: cardList.pos, right: data.pos, increment: -1} :
                {left: data.pos - 1, right: cardList.pos - 1, increment: 1};
            const cardLists = this._storage.get('card_lists');

            console.log(cardLists);
            for (let index = bound.left; index < bound.right; index +=1) {
                cardLists[index].pos += bound.increment;
            }

            // Обновим cardList:
            cardList.cardList_name = data.cardList_name;
            cardList.pos = data.pos;

            // Переупорядочим списки
            cardLists.sort((lhs, rhs) => {
                return lhs.pos - rhs.pos;
            });
            console.log('После переупорядочивания');
            console.log(cardLists);

            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('cardlist-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('cardlist-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Отображает popup удаления списка карточек
     * @param {Object} data информация о спике
     * @private
     */
    _showDeleteCardListPopUp(data) {
        this._storage.get('delete-cl-popup').visible = true;
        this._storage.get('delete-cl-popup').clid = data.clid;
        this._storage.get('delete-cl-popup').cardList_name =
            this._getCardListById(data.clid).cardList_name;
    }

    /**
     * Скрывает popup удаления списка карточек
     * @private
     */
    _hideDeleteCardListPopUp() {
        this._storage.get('delete-cl-popup').visible = false;
    }

    /**
     * Удаляет связанный с popup'ом cardlist
     * @param {Object} data результат диалога удаления
     * @private
     */
    async _deleteCardList(data) {
        this._hideDeleteCardListPopUp();
        if (!data.confirm) {
            return;
        }

        let payload;

        try {
            payload = await Network._deleteCardList(this._storage.get('delete-cl-popup').clid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:

            // Удалим список из storage
            const cardLists = this._storage.get('card_lists');
            const index = cardLists.indexOf(
                this._getCardListById(this._storage.get('delete-cl-popup').clid));
            cardLists.splice(index, 1);

            return;

        default:
            return;
        }
    }
}

export default new BoardStore();
