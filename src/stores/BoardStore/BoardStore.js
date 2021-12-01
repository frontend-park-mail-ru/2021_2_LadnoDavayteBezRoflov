import BaseStore from '../BaseStore.js';

// Actions
import {BoardsActionTypes} from '../../actions/boards.js';
import {CardListActionTypes} from '../../actions/cardlist.js';
import {CheckListActionTypes} from '../../actions/checklist';
import {CardActionTypes} from '../../actions/card.js';
import {BoardActionTypes} from '../../actions/board.js';
import {CommentsActionTypes} from '../../actions/comments.js';

// Modules
import Network from '../../modules/Network/Network.js';
import Router from '../../modules/Router/Router.js';
import Validator from '../../modules/Validator/Validator';

// Constants
import {
    CheckLists, ConstantMessages,
    HttpStatusCodes, Urls, BoardStoreConstants,
} from '../../constants/constants.js';

// Stores
import UserStore from '../UserStore/UserStore.js';
import SettingsStore from '../SettingsStore/SettingsStore.js';

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

        this._storage.set('card-popup', {
            visible: false,
            edit: false,
            cid: null,
            clid: null,
            position: null,
            positionRange: null,
            card_name: null,
            errors: null,
            checkLists: [],
            scroll: 0,
        });

        this._storage.set('delete-card-popup', {
            visible: false,
            cid: null,
        });

        this._storage.set('add-board-member-popup', {
            visible: false,
            errors: null,
            searchString: null,
            users: [],
            header: 'Добавить пользователя в доску',
        });

        this._storage.set('add-card-member-popup', {
            visible: false,
            errors: null,
            searchString: null,
            users: [],
            header: 'Добавить пользователя в карточку',
        });
    }

    /**
     * Метод, реализующий реакцию на рассылку Диспетчера.
     * @param {Action} action действие, которое будет обработано
     */
    async _onDispatch(action) {
        switch (action.actionName) {
        case BoardsActionTypes.BOARD_GET:
            await this._getBoard(action.data);
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

            /* Card */
        case CardActionTypes.CARD_CREATE_SHOW_POPUP:
            this._showCreateCardPopUp(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_EDIT_SHOW_POPUP:
            this._showEditCardPopUp(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_HIDE_POPUP:
            this._hideCardPopUp();
            this._emitChange();
            break;

        case CardActionTypes.CARD_UPDATE_SUBMIT:
            await this._updateCard(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_CREATE_SUBMIT:
            await this._createCard(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_DELETE_SHOW:
            this._showDeleteCardPopUp(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_DELETE_CHOOSE:
            await this._deleteCard(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_DELETE_HIDE:
            this._hideDeleteCardPopUp();
            this._emitChange();
            break;

            /* Card comments */

        case CommentsActionTypes.CARD_ADD_COMMENT:
            await this._createCardComment(action.data);
            this._emitChange();
            break;

        case CommentsActionTypes.CARD_DELETE_COMMENT:
            await this._deleteCardComment(action.data);
            this._emitChange();
            break;

        case CommentsActionTypes.CARD_EDIT_COMMENT:
            await this._editCardComment(action.data);
            this._emitChange();
            break;

        case CommentsActionTypes.CARD_UPDATE_COMMENT:
            await this._updateCardComment(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_UPDATE_STATUS:
            await this._updateDeadlineCheck(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_ADD_ASSIGNEE_SHOW:
            this._showAddCardAssigneePopUp();
            this._emitChange();
            break;

        case CardActionTypes.CARD_ADD_ASSIGNEE_CLOSE:
            this._hideAddCardAssigneePopUp();
            this._emitChange();
            break;

        case CardActionTypes.CARD_ADD_ASSIGNEE_INPUT:
            await this._refreshCardAssigneeSearchList(action.data);
            this._emitChange();
            break;

        case CardActionTypes.CARD_ADD_ASSIGNEE_USER_CLICKED:
            await this._toggleCardAssigneeInSearchList(action.data);
            this._emitChange();
            break;

        case BoardActionTypes.BOARD_ADD_MEMBER_SHOW:
            this._showAddBoardMemberPopUp();
            this._emitChange();
            break;

        case BoardActionTypes.BOARD_ADD_MEMBER_CLOSE:
            this._hideAddBoardMemberPopUp();
            this._emitChange();
            break;

        case BoardActionTypes.BOARD_ADD_MEMBER_INPUT:
            await this._refreshBoardMemberSearchList(action.data);
            this._emitChange();
            break;

        case BoardActionTypes.BOARD_ADD_MEMBER_USER_CLICKED:
            await this._toggleBoardMemberInSearchList(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_CREATE:
            await this._createCheckList();
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_EDIT:
            this._editCheckList(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_SAVE:
            await this._saveCheckList(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_DELETE:
            await this._deleteCheckList(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_CREATE:
            await this._createCheckListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_EDIT:
            this._editCheckListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_SAVE:
            await this._saveChekListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_DELETE:
            await this._deleteCheckListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_TOGGLE:
            await this._toggleChekListItem(action.data);
            this._emitChange();
            break;

        case CardActionTypes.SCROLL_CHANGED:
            this._changeCardPopUpScroll(action.data);
            this._emitChange();
            break;


        default:
            return;
        }
    }

    /**
     * Метод, реализующий реакцию на запрос доски с id.
     * @param {Object} data полезная нагрузка запроса
     */
    async _getBoard(data) {
        const validator = new Validator();
        const options = {year: 'numeric', month: 'short', day: '2-digit'};

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

            this._storage.get('card_lists').forEach((cardlist) => {
                cardlist.cards.forEach((card) => {
                    card.deadlineStatus = validator.validateDeadline(card.deadline, card.deadline_check);
                    card.deadlineCheck = card.deadline_check;
                    card.deadlineDate = (new Date(card.deadline)).toLocaleDateString('ru-RU', options);
                });
            });

            this._storage.set('members', payload.data.members || []); // todo payload.data.members
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
            payload = await Network.updateBoard({
                ...data,
                members: this._storage.get('members'),
            }, this._storage.get('bid'));
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
            this._storage.get('setting-popup').visible = false;
            Router.go(Urls.Boards, true);
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

        let payload;

        try {
            payload = await Network._createCardList(data);
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

            const cardList = this._getCardListById(this._storage.get('cardlist-popup').clid);
            const bound = data.pos > cardList.pos ?
                {left: cardList.pos, right: data.pos, increment: -1} :
                {left: data.pos - 1, right: cardList.pos - 1, increment: 1};

            // Обновим позиции списков в storage
            const cardLists = this._storage.get('card_lists');

            for (let index = bound.left; index < bound.right; index += 1) {
                cardLists[index].pos += bound.increment;
            }

            // Обновим cardList:
            cardList.cardList_name = data.cardList_name;
            cardList.pos = data.pos;

            // Переупорядочим списки
            cardLists.sort((lhs, rhs) => {
                return lhs.pos - rhs.pos;
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
            const clidForDeletion = this._storage.get('delete-cl-popup').clid;
            const cardLists = this._storage.get('card_lists');
            const clid = cardLists.findIndex(({clid}) => clid === clidForDeletion);
            if (clid === -1) {
                throw new Error(`BoardStore: список карточек ${clidForDeletion} не найден `);
            }
            cardLists.splice(clid, 1);

        default:
            return;
        }
    }

    /* Секция карточек */

    /**
     * Делает popup создания карточки видимым
     * @private
     * @param {object} data данные из запроса
     */
    _showCreateCardPopUp(data) {
        this._storage.get('card-popup').visible = true;
        this._storage.get('card-popup').edit = false;
        this._storage.get('card-popup').errors = null;
        this._storage.get('card-popup').clid = data.clid;
        this._storage.get('card-popup').checkLists = [];
    }

    /**
     * Делает popup создания карточки видимым
     * @param {object} data данные из запроса
     * @private
     */
    _getCard(data) {
        this._storage.get('card-popup').visible = true;
        this._storage.get('card-popup').edit = false;
        this._storage.get('card-popup').errors = null;
        this._storage.get('card-popup').clid = data.clid;
    }

    /**
     * Создает новую карточку
     * @param {Object} data информация о карточке
     * @private
     */
    async _createCard(data) {
        this._storage.get('card-popup').errors = null;
        const validator = new Validator();

        data.deadline = validator.validateDeadlineInput(data.deadline);

        this._storage.get('card-popup').errors = validator.validateCardTitle(data.card_name);
        if (this._storage.get('card-popup').errors) {
            return;
        }

        data.bid = this._storage.get('bid');
        data.clid = this._storage.get('card-popup').clid;

        let payload;

        try {
            payload = await Network._createCard(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const validator = new Validator();
            const options = {year: 'numeric', month: 'short', day: '2-digit'};
            this._storage.get('card-popup').visible = false;
            this._getCardListById(data.clid).cards.push({
                cid: payload.data.cid,
                bid: this._storage.get('bid'),
                card_name: data.card_name,
                description: data.description,
                pos: this._getCardListById(data.clid).cards.length + 1,
                comments: [],
                deadline: data.deadline,
                deadline_check: false,
                deadlineStatus: validator.validateDeadline(
                    data.deadline, false),
                deadlineDate: (new Date(data.deadline)).toLocaleDateString('ru-RU', options),
                assignees: [],
                check_lists: [],
            });
            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('card-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('card-popup').errors = ConstantMessages.CardListErrorOnServer; // CARDLIST
            return;
        }
    }

    /**
     * Скрывает popup создания/редактирования карточки
     * @private
     */
    _hideCardPopUp() {
        this._storage.get('card-popup').visible = false;
        this._storage.get('card-popup').errors = null;
    }

    /**
     * Возвращает объект card из storage
     * @param {Number} clid id списка карточек
     * @param {Number} cid id карточки
     * @return {Object} найденный объект
     * @private
     */
    _getCardById(clid, cid) {
        const result = this._getCardListById(clid).cards.find((card) => {
            return card.cid === cid;
        });
        if (!result) {
            throw new Error(`BoardStore: ошибка в функции _getCardById' +
             '(карточка в столбце ${clid} с айди ${cid} не найдена)`);
        }
        return result;
    }

    /**
     * Показывает popup редактирования карточки
     * @param {Object} data информация о карточке
     * @private
     */
    _showEditCardPopUp(data) {
        const card = this._getCardById(data.clid, data.cid);

        this._storage.set('card-popup', {
            visible: true,
            edit: true,
            cid: data.cid,
            clid: data.clid,
            position: card.pos,
            positionRange: Array.from(
                {length: this._getCardListById(data.clid).cards.length},
                (_, index) => index + 1),
            card_name: card.card_name,
            description: card.description,
            comments: card.comments,
            deadline: card.deadline,
            deadline_check: card.deadline_check,
            errors: null,
            checkLists: this._getCardById(data.clid, data.cid).check_lists.map((list) => {
                const items = list.check_list_items.map((item) => {
                    return {...item, edit: false};
                });
                return {...list, check_list_items: items, edit: false};
            }),
            scroll: 0,
        });
    }

    /**
     * Меняет статус дедлайна (выполнено | не выполнено)
     * @param {Object} data информация о карточке
     * @private
     */
    async _updateDeadlineCheck(data) {
        const card = this._getCardById(
            data.clid,
            data.cid,
        );

        let payload;

        const _data = {
            pos: card.pos,
            cid: card.cid,
            clid: card.clid,
            card_name: card.card_name,
            description: card.description,
            bid: card.bid,
            deadline: card.deadline,
            deadline_check: !card.deadline_check,
        };

        try {
            payload = await Network._updateCard(_data, card.cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const validator = new Validator();
            card.deadlineStatus = validator.validateDeadline(
                payload.data.deadline, payload.data.deadline_check);
            card.deadline_check = payload.data.deadline_check;
            return;

        case HttpStatusCodes.Forbidden:
            // todo
            return;

        default:
            // todo
            return;
        }
    }

    /**
     * Обновляет текущий card
     * @param {Object} data новые данные списка
     * @return {Promise<void>}
     * @private
     */
    async _updateCard(data) {
        this._storage.get('card-popup').errors = null;
        const validator = new Validator();

        data.deadline = validator.validateDeadlineInput(data.deadline);

        this._storage.get('card-popup').errors = validator.validateCardTitle(data.card_name);
        if (this._storage.get('card-popup').errors) {
            return;
        }

        let payload;

        const _data = {
            pos: data.pos,
            cid: this._storage.get('card-popup').cid,
            clid: this._storage.get('card-popup').clid,
            card_name: data.card_name,
            description: data.description,
            bid: this._storage.get('card-popup').bid,
            deadline: data.deadline,
            deadline_check: data.deadline_check,
        };

        try {
            payload = await Network._updateCard(_data, this._storage.get('card-popup').cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('card-popup').visible = false;

            const card = this._getCardById(
                this._storage.get('card-popup').clid,
                this._storage.get('card-popup').cid,
            );
            const bound = data.pos > card.pos ?
                {left: card.pos, right: data.pos, increment: -1} :
                {left: data.pos - 1, right: card.pos - 1, increment: 1};

            const cards = this._getCardListById(this._storage.get('card-popup').clid).cards;

            for (let index = bound.left; index < bound.right; index += 1) {
                cards[index].pos += bound.increment;
            }

            // Обновим card:
            const options = {year: 'numeric', month: 'short', day: '2-digit'};

            card.card_name = data.card_name;
            card.description = data.description;
            card.pos = data.pos;

            card.deadline = data.deadline;
            card.deadlineStatus = validator.validateDeadline(data.deadline, data.deadline_check);
            card.deadline_check = data.deadline_check;
            card.deadlineDate = (new Date(data.deadline)).toLocaleDateString('ru-RU', options);

            // Переупорядочим списки
            cards.sort((lhs, rhs) => {
                return lhs.pos - rhs.pos;
            });

            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('card-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('card-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Отображает popup удаления карточки
     * @param {Object} data информация о спике
     * @private
     */
    _showDeleteCardPopUp(data) {
        this._storage.set('delete-card-popup', {
            visible: true,
            cid: data.cid,
            clid: data.clid,
            card_name: this._getCardById(data.clid, data.cid).card_name,
        });
    }

    /**
     * Скрывает popup удаления карточки
     * @private
     */
    _hideDeleteCardPopUp() {
        this._storage.get('delete-card-popup').visible = false;
    }

    /**
     * Удаляет связанный с popup'ом card
     * @param {Object} data результат диалога удаления
     * @private
     */
    async _deleteCard(data) {
        this._hideDeleteCardPopUp();
        if (!data.confirmation) {
            return;
        }

        let payload;

        try {
            payload = await Network._deleteCard(this._storage.get('delete-card-popup').cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:

            // Удалим из storage
            const cidForDeletion = this._storage.get('delete-card-popup').cid;
            const clidForDeletion = this._storage.get('delete-card-popup').clid;

            const cardLists = this._storage.get('card_lists');

            const clid = cardLists.findIndex(({clid}) => clid === clidForDeletion);
            if (clid === -1) {
                throw new Error(`BoardStore: список карточек ${clidForDeletion} не найден.`);
            }

            const cid = cardLists[clid].cards.findIndex(({cid}) => cid === cidForDeletion);
            if (cid === -1) {
                throw new Error(`BoardStore: карточка ${cidForDeletion} не найдена.`);
            }
            cardLists[clid].cards.splice(cid, 1);

        default:
            return;
        }
    }

    /**
     * Метод выполняет поиск чеклиста по его ID
     * @param {Number} chlid
     * @return {Object} найденный элемент
     * @private
     */
    _getCheckListById(chlid) {
        const context = this._storage.get('card-popup');
        return context.checkLists.find((list) => {
            return list.chlid === chlid;
        });
    }

    /**
     * Метод выполняет поиск элемента чеклиста по паре id
     * @param {Number} chlid - id чеклиста
     * @param {Number} chliid - id элемента чеклиста
     * @return {Object} найденный элемент
     * @private
     */
    _getCheckListItemById(chlid, chliid) {
        return this._getCheckListById(chlid).check_list_items.find((item) => {
            return item.chliid === chliid;
        });
    }

    /**
     * Создает чеклист
     * @private
     */
    async _createCheckList() {
        const context = this._storage.get('card-popup');
        context.errors = null;

        const newCheckList = {
            cid: context.cid,
            title: CheckLists.CheckListDefaultTitle + ' ' + context.checkLists.length,
            check_list_items: [],
        };

        let payload;

        try {
            payload = await Network.createCheckList(newCheckList);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            newCheckList.chlid = payload.data.chlid;
            context.checkLists.push(newCheckList);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Переключает чеклист в режим редактирования
     * @param {Object} data - объект с данными action'a
     * @private
     */
    _editCheckList(data) {
        const checkLists = this._storage.get('card-popup').checkLists;
        const checkList = checkLists.find((checkList) => {
            return checkList.chlid === data.chlid;
        });
        checkList.edit = true;
    }

    /**
     * Сохраняет новый заголовок чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _saveCheckList(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;
        const checkList = this._getCheckListById(data.chlid);

        const newCheckList = {...checkList};
        newCheckList.title = data.title;

        let payload;

        try {
            payload = await Network.updateCheckList(newCheckList, data.chlid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            checkList.title = data.title;
            checkList.edit = false;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Удаляет чеклист
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _deleteCheckList(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;

        let payload;

        try {
            payload = await Network.deleteCheckList(data.chlid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const delCheckList = context.checkLists.find((checklist) => {
                return checklist.chlid === data.chlid;
            });
            context.checkLists.splice(context.checkLists.indexOf(delCheckList), 1);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Создает элемент чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _createCheckListItem(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;
        const checkList = this._getCheckListById(data.chlid);

        const newCheckListItem = {
            chlid: data.chlid,
            text: CheckLists.CheckListItemDefaultTitle + ' ' + checkList.check_list_items.length,
            status: false,
        };

        let payload;

        try {
            payload = await Network.createCheckListItem(newCheckListItem);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            newCheckListItem.chliid = payload.data.chliid;
            checkList.check_list_items.push(newCheckListItem);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Перключает элемент чеклиста в режим редактирования
     * @param {Object} data - объект с данными action'a
     * @private
     */
    _editCheckListItem(data) {
        this._getCheckListItemById(data.chlid, data.chliid).edit = true;
    }

    /**
     * Сохраняет текст элемента чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _saveChekListItem(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;
        const item = this._getCheckListItemById(data.chlid, data.chliid);

        const newItem = {...item};
        newItem.text = data.text;

        let payload;

        try {
            payload = await Network.updateCheckListItem(newItem, data.chliid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            item.text = data.text;
            item.edit = false;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Удаляет элемент чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _deleteCheckListItem(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;

        let payload;

        try {
            payload = await Network.deleteCheckListItem(data.chliid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const list = this._getCheckListById(data.chlid);
            const item = this._getCheckListItemById(data.chlid, data.chliid);
            list.check_list_items.splice(list.check_list_items.indexOf(item), 1);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Переключает чекбокс элемента чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _toggleChekListItem(data) {
        const context = this._storage.get('card-popup');
        context.errors = null;
        const item = this._getCheckListItemById(data.chlid, data.chliid);

        const newItem = {...item};
        newItem.status = !newItem.status;

        let payload;

        try {
            payload = await Network.updateCheckListItem(newItem, data.chliid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            item.status = !item.status;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Метод включает popup добавления участника в карточку и устанавливает контекст
     * @private
     */
    _showAddCardAssigneePopUp() {
        const context = this._storage.get('add-card-member-popup');
        context.visible = true;
        context.errors = null;
        context.searchString = null;
        const card = this._getCardById(this._storage.get('card-popup').clid,
                                       this._storage.get('card-popup').cid);
        context.users = card.assignees.map((assignee) => {
            return {...assignee, added: true};
        });

        if (!context.users.length) {
            context.users = this._storage.get('members').slice();
        }
    }

    /**
     * Метод выключает popup добавления участника в карточку
     * @private
     */
    _hideAddCardAssigneePopUp() {
        this._storage.get('add-card-member-popup').visible = false;
    }

    /**
     * Метод обновляет список пользователей в контексте popup'a добавления участника карточки
     * @param {Object} data - объект с текстом поиска
     * @private
     */
    async _refreshCardAssigneeSearchList(data) {
        const context = this._storage.get('add-card-member-popup');
        context.errors = null;
        const {searchString} = data;
        context.searchString = searchString;

        if (searchString.length < BoardStoreConstants.MinUserNameSearchLength) {
            const card = this._getCardById(this._storage.get('card-popup').clid,
                                           this._storage.get('card-popup').cid);
            context.users = card.assignees.map((assignee) => {
                return {...assignee, added: true};
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
            payload = await Network.searchCardMembers(searchString, this._storage.get('card-popup').cid);
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
     * Метод добавляет/исключает пользователя из карточки
     * @param {Object} data - объект с uid пользователя
     * @private
     */
    async _toggleCardAssigneeInSearchList(data) {
        const context = this._storage.get('add-card-member-popup');
        context.errors = null;

        const card = this._getCardById(this._storage.get('card-popup').clid,
                                       this._storage.get('card-popup').cid);
        const assignees = card.assignees.slice();

        // Найдем выбранного пользователя в списке assignees карточки
        const assignee = card.assignees.find((assignee) => {
            return assignee.uid === data.uid;
        });

        // Найдем выбранного пользователя в списке пользователей popup'a
        const user = context.users.find((user) => {
            return user.uid === data.uid;
        });

        // Если пользователь был в assignees, исключим его от туда. Иначе - добавим.
        if (assignee) {
            assignees.splice(assignees.indexOf(assignee), 1);
        } else {
            assignees.push({uid: user.uid, userName: user.userName, avatar: user.avatar});
        }

        const updatedCard = {...card};
        updatedCard.assignees = assignees;
        let payload;

        try {
            payload = await Network.toggleCardMember(this._storage.get('card-popup').cid, data.uid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            user.added = !assignee;
            card.assignees = assignees;
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Метод включает popup добавления опльзователя в доску и устанавливает контекст
     * @private
     */
    _showAddBoardMemberPopUp() {
        const context = this._storage.get('add-board-member-popup');
        context.visible = true;
        context.errors = null;
        context.searchString = null;
        context.users = this._storage.get('members').map((member) => {
            return {...member, added: true};
        });
    }

    /**
     * Метод скрывает popup добавления пользователя в доску
     * @private
     */
    _hideAddBoardMemberPopUp() {
        this._storage.get('add-board-member-popup').visible = false;
    }

    /**
     * Метод добавляет/исключает пользователя из доски
     * @param {Object} data - объект с uid пользователя
     * @private
     */
    async _toggleBoardMemberInSearchList(data) {
        const context = this._storage.get('add-board-member-popup');
        context.errors = null;

        const members = this._storage.get('members').slice();
        // Найдем выбранного пользователя в списке членов доски
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

        const updatedBoard = {
            description: this._storage.get('description'),
            board_name: this._storage.get('board_name'),
            members: members,
        };

        let payload;

        try {
            payload = await Network.updateBoard(updatedBoard, this._storage.get('bid'));
            payload = await Network.toggleBoardMember(this._storage.get('bid'), data.uid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            user.added = !member;
            this._storage.set('members', members);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Метод обновляет список пользователей в контексте popup'a добавления пользователя в доску
     * @param {Object} data - объект с текстом поиска
     * @private
     */
    async _refreshBoardMemberSearchList(data) {
        const context = this._storage.get('add-board-member-popup');
        context.errors = null;
        const {searchString} = data;
        context.searchString = searchString;

        if (searchString.length < BoardStoreConstants.MinUserNameSearchLength) {
            context.users = this._storage.get('members').map((member) => {
                return {...member, added: true};
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
            payload = await Network.searchBoardMembers(searchString, this._storage.get('bid'));
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
     * Создает комментарий
     * @param {Object} data данные
     * @return {Promise<void>}
     * @private
     */
    async _createCardComment(data) {
        const context = this._storage.get('card-popup');

        const comment = {
            cid: context.cid,
            text: data.text,
        };

        let payload;

        try {
            payload = await Network.createComment(comment);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            context.comments.push({
                cmid: payload.data.cmid,
                cid: this._storage.get('card-popup').cid,
                user: {
                    userName: SettingsStore.getContext('login'),
                    avatar: SettingsStore.getContext('avatar'),
                },
                text: data.text,
                date: payload.data.date,
            });

            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('card-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('card-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Переключает комментарий в режим редактирования
     * @param {Object} data - данные по комменту
     * @private
     */
    async _editCardComment(data) {
        const comments = this._storage.get('card-popup').comments;
        const comment = comments.find((comment) => {
            return comment.cmid === data.cmid;
        });
        if (!comment) {
            throw new Error(`BoardStore: комментарий с индексом ${data.cmid} не найден`);
        }
        comment.edit = !comment.edit;
    }

    /**
     * Обновляет комментарий
     * @param {Object} data новые данные
     * @return {Promise<void>}
     * @private
     */
    async _updateCardComment(data) {
        let payload;

        try {
            payload = await Network.updateComment(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const comments = this._storage.get('card-popup').comments;
            const comment = comments.find((item) => {
                return item.cmid === data.cmid;
            });

            if (!comment) {
                throw new Error(`BoardStore: комментарий ${data.cmid} не найден.`);
            }

            comment.text = data.text;
            comment.edit = false;

            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('card-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('card-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Удаляет комментарий
     * @param {Object} data данные
     * @return {Promise<void>}
     * @private
     */
    async _deleteCardComment(data) {
        let payload;

        try {
            payload = await Network.deleteComment(data);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const card = this._getCardById(
                this._storage.get('card-popup').clid,
                this._storage.get('card-popup').cid,
            );

            const cmid = card.comments.findIndex(({cmid}) => cmid === data.cmid);
            if (cmid === -1) {
                throw new Error(`BoardStore: комментарий ${data.cmid} не найден.`);
            }

            card.comments.splice(cmid, 1);

            return;

        case HttpStatusCodes.Forbidden:
            this._storage.get('card-popup').errors = ConstantMessages.BoardNoAccess;
            return;

        default:
            this._storage.get('card-popup').errors = ConstantMessages.CardListErrorOnServer;
            return;
        }
    }

    /**
     * Сохраняет скролл
     * @param {Object} data данные
     * @private
     */
    _changeCardPopUpScroll(data) {
        this._storage.get('card-popup').scroll = data.scrollValue;
    }
}

export default new BoardStore();
