import BaseStore from '../BaseStore.js';

// Actions
import {BoardsActionTypes} from '../../actions/boards.js';
import {CardListActionTypes} from '../../actions/cardlist.js';
import {CheckListActionTypes} from '../../actions/checklist';
import {CardActionTypes} from '../../actions/card.js';
import {BoardActionTypes} from '../../actions/board.js';
import {CommentsActionTypes} from '../../actions/comments.js';
import {TagsActionTypes} from '../../actions/tags';

// Modules
import Network from '../../modules/Network/Network.js';
import Router from '../../modules/Router/Router.js';
import Validator from '../../modules/Validator/Validator';

// Constants
import {
    BoardStoreConstants,
    CheckLists,
    ConstantMessages, HTTP,
    HttpStatusCodes, ServiceWorker,
    Urls,
} from '../../constants/constants.js';

// Stores
import UserStore from '../UserStore/UserStore.js';
import SettingsStore from '../SettingsStore/SettingsStore.js';
import {InviteActionTypes} from '../../actions/invite.js';
import {AttachmentsActionTypes} from '../../actions/attachments.js';

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
            inviteLink: null,
            selectInvite: false,
        });

        this._storage.set('add-card-member-popup', {
            visible: false,
            errors: null,
            searchString: null,
            users: [],
            header: 'Добавить пользователя в карточку',
            inviteLink: null,
            selectInvite: false,
        });

        this._storage.set('tags-list-popup', {
            visible: false,
            errors: null,
            toggle_mode: false,
            tags: [],
        });

        this._storage.set('tag-popup', {
            visible: false,
            errors: null,
            edit: false,
            tag_name: null,
            colors: [],
            picked_color: null,
            tgid: null,
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
            await this._saveCheckListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_DELETE:
            await this._deleteCheckListItem(action.data);
            this._emitChange();
            break;

        case CheckListActionTypes.CHECKLIST_ITEM_TOGGLE:
            await this._toggleCheckListItem(action.data);
            this._emitChange();
            break;

        case CardActionTypes.SCROLL_CHANGED:
            this._changeCardPopUpScroll(action.data);
            this._emitChange();
            break;

        /* Attachments */
        case AttachmentsActionTypes.UPLOAD:
            await this._uploadAttachment(action.data);
            this._emitChange();
            break;

        case AttachmentsActionTypes.DELETE:
            await this._deleteAttachment(action.data);
            this._emitChange();
            break;

        case AttachmentsActionTypes.DOWNLOAD:
            this._downloadAttachment(action.data);
            break;

        /* Invite: */
        case InviteActionTypes.GO_BOARD_INVITE:
            await this._openBoardInvite(action.data);
            this._emitChange();
            break;

        case InviteActionTypes.GO_CARD_INVITE:
            await this._openCardInvite(action.data);
            this._emitChange();
            break;

        case InviteActionTypes.REFRESH_BOARD_LINK:
            await this._refreshBoardInvite();
            this._emitChange();
            break;

        case InviteActionTypes.REFRESH_CARD_LINK:
            await this._refreshCardInvite();
            this._emitChange();
            break;

        case InviteActionTypes.COPY_BOARD_LINK:
            await this._copyBoardInvite();
            this._emitChange();
            break;

        case InviteActionTypes.COPY_CARD_LINK:
            await this._copyCardInvite();
            this._emitChange();
            break;
        case TagsActionTypes.SHOW_LIST_POPUP_BOARD:
            this._showTagListPopUpBoard();
            this._emitChange();
            break;

        case TagsActionTypes.SHOW_LIST_POPUP_CARD:
            this._showTagListPopUpCard();
            this._emitChange();
            break;

        case TagsActionTypes.HIDE_LIST_POPUP:
            this._hideTagListPopUp();
            this._emitChange();
            break;

        case TagsActionTypes.SHOW_TAG_POPUP_EDIT:
            this._showTagEditPopUp(action.data);
            this._emitChange();
            break;

        case TagsActionTypes.SHOW_TAG_POPUP_CREATE:
            this._showTagCreatePopUp();
            this._emitChange();
            break;

        case TagsActionTypes.HIDE_TAG_POPUP:
            this._hideTagPopUp();
            this._emitChange();
            break;

        case TagsActionTypes.CREATE_TAG:
            await this._createTag(action.data);
            this._emitChange();
            break;

        case TagsActionTypes.DELETE_TAG:
            await this._deleteTag();
            this._emitChange();
            break;

        case TagsActionTypes.UPDATE_TAG:
            await this._updateTag();
            this._emitChange();
            break;

        case TagsActionTypes.TOGGLE_TAG:
            await this._toggleTag(action.data);
            this._emitChange();
            break;

        case TagsActionTypes.PICK_COLOR:
            this._pickColor(action.data);
            this._emitChange();
            break;

        case TagsActionTypes.EDIT_TAG_NAME:
            this._editTagName(action.data);
            break;

        default:
            return;
        }
    }

    /**
     * Создает приглашение на карточку
     * @param {String} accessPath - путь
     * @private
     */
    _setCardInvite(accessPath) {
        this._storage.get('add-card-member-popup').inviteLink =
            `${HTTP.Scheme}://${HTTP.SelfAddress.Url}${DEBUG ? `:${HTTP.SelfAddress.Port}` : ''}` +
            Urls.Invite.CardPath + accessPath;
    }

    /**
     * Создает приглашение на доску
     * @param {String} accessPath - путь
     * @private
     */
    _setBoardInvite(accessPath) {
        this._storage.get('add-board-member-popup').inviteLink =
            `${HTTP.Scheme}://${HTTP.SelfAddress.Url}${DEBUG ? `:${HTTP.SelfAddress.Port}` : ''}` +
            Urls.Invite.BoardPath + accessPath;
    }

    /**
     * Ищет тег среди полученных вместе с доской тегов
     * @param {Number} tgid id тега
     * @return {Object} объект тега
     * @private
     */
    _getTagById(tgid) {
        return this._storage.get('tags-list-popup').tags.find((tag) => {
            return tag.tgid === tgid;
        });
    }

    /**
     * Ищет цвет среди полученных вместе с доской цветов тегов
     * @param {Number} clrid id цвета
     * @return {Object} объект цвета
     * @private
     */
    _getTagColorById(clrid) {
        return this._storage.get('tag-popup').colors.find((color) => {
            return color.clrid === clrid;
        });
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

            // todo network + selected = false, переключаем при отображение card
            this._storage.get('tags-list-popup').tags = payload.data.tags.map((tag) => {
                tag.selected = false;
                return tag;
            });

            this._storage.get('tag-popup').colors = payload.data.colors.map((color) => {
                color.selected = false;
                return color;
            });

            this._storage.get('card_lists').forEach((cardlist) => {
                cardlist.cards.forEach((card) => {
                    card.deadlineStatus = validator.validateDeadline(card.deadline, card.deadline_check);
                    card.deadlineCheck = card.deadline_check;
                    card.deadlineDate = (new Date(card.deadline)).toLocaleDateString('ru-RU', options);
                    card.attachments = card.attachments || [];
                    // Сохраним в карточке ссылки на теже теги, что и в списке тегов
                    card.tags = card.tags.map((tag) => {
                        return this._getTagById(tag.tgid);
                    });
                });
            });

            this._storage.set('members', payload.data.members || []); // todo payload.data.members
            this._storage.set('invited_members', payload.data.invited_members || []);
            this._setBoardInvite(payload.data.access_path);
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
        if (SettingsStore.isOffline()) {
            this._storage.get('setting-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
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
        if (SettingsStore.isOffline()) {
            this._storage.get('cardlist-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
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
        if (SettingsStore.isOffline()) {
            this._storage.get('cardlist-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
        this._storage.get('cardlist-popup').errors = null;
        const validator = new Validator();

        this._storage.get('cardlist-popup').errors = validator.validateCardListTitle(data.cardList_name);
        if (this._storage.get('cardlist-popup').errors) {
            return;
        }

        let payload;

        const clid = (data.clid? data.clid : this._storage.get('cardlist-popup').clid);

        try {
            payload = await Network._updateCardList(data, clid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('cardlist-popup').visible = false;

            const cardList = this._getCardListById(clid);
            const bound = data.pos > cardList.pos ?
                {left: cardList.pos, right: data.pos, increment: -1} :
                {left: data.pos - 1, right: cardList.pos - 1, increment: 1};

            // Обновим позиции списков в storage
            const cardLists = this._storage.get('card_lists');

            if (data.pos !== cardList.pos) {
                const cardListIndex = cardLists.indexOf(cardList);
                cardLists.splice(data.pos - 1, 0, cardLists.splice(cardListIndex, 1)[0]);
            }

            for (let index = bound.left; index < bound.right; index += 1) {
                cardLists[index].pos += bound.increment;
            }

            // Обновим cardList:
            cardList.cardList_name = data.cardList_name;
            cardList.pos = cardLists.indexOf(cardList) + 1;

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
        if (SettingsStore.isOffline()) {
            this._storage.get('card-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
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
                tags: [],
                check_lists: [],
                access_path: payload.data.access_path,
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
            tags: card.tags,
            checkLists: this._getCardById(data.clid, data.cid).check_lists.map((list) => {
                const items = list.check_list_items.map((item) => {
                    return {...item, edit: false};
                });
                return {...list, check_list_items: items, edit: false};
            }),
            scroll: 0,
            attachments: card.attachments,
        });
    }

    /**
     * Меняет статус дедлайна (выполнено | не выполнено)
     * @param {Object} data информация о карточке
     * @private
     */
    async _updateDeadlineCheck(data) {
        if (SettingsStore.isOffline()) {
            return;
        }
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
        if (SettingsStore.isOffline()) {
            this._storage.get('card-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
        this._storage.get('card-popup').errors = null;
        const validator = new Validator();

        data.deadline = validator.validateDeadlineInput(data.deadline);

        this._storage.get('card-popup').errors = validator.validateCardTitle(data.card_name);
        if (this._storage.get('card-popup').errors) {
            return;
        }

        let payload;

        const _data = {
            position: data.position,
            pos: data.pos,
            cid: (data.cid? data.cid : this._storage.get('card-popup').cid),
            clid: (data.clid? data.clid : this._storage.get('card-popup').clid),
            card_name: data.card_name,
            description: data.description,
            bid: (data.bid? data.bid : this._storage.get('card-popup').bid),
            deadline: data.deadline,
            deadline_check: data.deadline_check,
        };

        try {
            payload = await Network._updateCard(_data, _data.cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._storage.get('card-popup').visible = false;

            const card = this._getCardById(
                (data.clidPrev? data.clidPrev : _data.clid),
                _data.cid,
            );
            const bound = data.pos > card.pos ?
                {left: card.pos, right: data.pos, increment: -1} :
                {left: data.pos - 1, right: card.pos - 1, increment: 1};

            const cards = this._getCardListById(_data.clid).cards;

            if (data.clidPrev) {
                if (data.clidPrev !== _data.clid) {
                    const oldCards = this._getCardListById(data.clidPrev).cards;
                    oldCards.splice(oldCards.indexOf(card), 1);
                    cards.splice(card.pos - 1, 0, card);
                } else {
                    const cardIndex = cards.indexOf(card);
                    cards.splice(card.pos - 1, 0, cards.splice(cardIndex, 1)[0]);
                }
            }

            for (let index = bound.left; index < bound.right; index += 1) {
                cards[index].pos += bound.increment;
            }

            // Обновим card:
            const options = {year: 'numeric', month: 'short', day: '2-digit'};

            card.card_name = data.card_name;
            card.description = data.description;
            card.position = data.pos;
            card.pos = cards.indexOf(card) + 1;

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
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
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
            this._getCardById(context.clid, context.cid).check_lists.push(
                JSON.parse(JSON.stringify(newCheckList)),
            );
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
        this._getCheckListById(data.chlid).edit = true;
    }

    /**
     * Сохраняет новый заголовок чеклиста
     * @param {Object} data - объект с данными action'a
     * @private
     */
    async _saveCheckList(data) {
        const context = this._storage.get('card-popup');
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
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
            this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            }).title = data.title;
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
            let delCheckList = context.checkLists.find((checklist) => {
                return checklist.chlid === data.chlid;
            });
            context.checkLists.splice(context.checkLists.indexOf(delCheckList), 1);
            delCheckList = this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            });
            this._getCardById(context.clid, context.cid).check_lists
                .splice(context.checkLists.indexOf(delCheckList), 1);
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
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
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
            this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            }).check_list_items.push(JSON.parse(JSON.stringify(newCheckListItem)));
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
    async _saveCheckListItem(data) {
        const context = this._storage.get('card-popup');
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
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
            this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            }).check_list_items.find((chLstItem) => {
                return chLstItem.chliid === data.chliid;
            }).text = data.text;
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
            let list = this._getCheckListById(data.chlid);
            let item = this._getCheckListItemById(data.chlid, data.chliid);
            list.check_list_items.splice(list.check_list_items.indexOf(item), 1);

            list = this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            });
            item = list.check_list_items.find((checkLstItem) => {
                return checkLstItem.chliid === data.chliid;
            });
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
    async _toggleCheckListItem(data) {
        const context = this._storage.get('card-popup');
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
        context.errors = null;
        context.selectInvite = false;
        let item = this._getCheckListItemById(data.chlid, data.chliid);

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
            item = this._getCardById(context.clid, context.cid).check_lists.find((checkLst) => {
                return checkLst.chlid === data.chlid;
            }).check_list_items.find((checkLstItem) => {
                return checkLstItem.chliid === data.chliid;
            }).status = !item.status;
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
        this._setCardInvite(card.access_path);
        context.selectInvite = false;

        if (!context.users.length) {
            context.users = this._storage.get('members').slice();
        }
    }

    /**
     * Метод выключает popup добавления участника в карточку
     * @private
     */
    _hideAddCardAssigneePopUp() {
        this._storage.get('add-card-member-popup').selectInvite = false;
        this._storage.get('add-card-member-popup').visible = false;
    }

    /**
     * Метод обновляет список пользователей в контексте popup'a добавления участника карточки
     * @param {Object} data - объект с текстом поиска
     * @private
     */
    async _refreshCardAssigneeSearchList(data) {
        const context = this._storage.get('add-card-member-popup');
        context.selectInvite = false;
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
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
        context.errors = null;
        context.selectInvite = false;

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
        context.selectInvite = false;
        context.visible = true;
        context.errors = null;
        context.searchString = null;
        context.users = this._storage.get('invited_members').map((member) => {
            return {...member, added: true};
        });
    }

    /**
     * Метод скрывает popup добавления пользователя в доску
     * @private
     */
    _hideAddBoardMemberPopUp() {
        this._storage.get('add-board-member-popup').selectInvite = false;
        this._storage.get('add-board-member-popup').visible = false;
    }

    /**
     * Удаляет пользоватлея из карточки
     * @param {Number} uid id удаляемого юзера
     * @private
     */
    _removeUserFromCards(uid) {
        this._storage.get('card_lists').forEach((cardList) => {
            cardList.cards.forEach((card) => {
                const cardMember = card.assignees.find((assignee) => {
                    return assignee.uid === uid;
                });
                if (cardMember) {
                    card.assignees.splice(card.assignees.indexOf(cardMember), 1);
                }
            });
        });
    }

    /**
     * Метод добавляет/исключает пользователя из доски
     * @param {Object} data - объект с uid пользователя
     * @private
     */
    async _toggleBoardMemberInSearchList(data) {
        const context = this._storage.get('add-board-member-popup');
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }
        context.selectInvite = false;
        context.errors = null;

        const members = this._storage.get('invited_members').slice();
        // Найдем выбранного пользователя в списке членов доски
        const member = members.find((memeber) => {
            return memeber.uid === data.uid;
        });

        // Найдем выбранного пользователя в списке пользователей popup'a
        const user = context.users.find((user) => {
            return user.uid === data.uid;
        });

        if (user.userName === SettingsStore.getContext('login')) {
            console.log('todo: попытка удалить самого себя из доски');
            return;
        }

        // Если пользователь был в members, исключим его от туда. Иначе - добавим.
        if (member) {
            members.splice(members.indexOf(member), 1);
        } else {
            members.push({uid: user.uid, userName: user.userName, avatar: user.avatar});
        }

        let payload;

        try {
            payload = await Network.toggleBoardMember(this._storage.get('bid'), data.uid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            user.added = !member;
            this._storage.set('members', members);
            if (!user.added) {
                this._removeUserFromCards(user.uid);
            }
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
        context.selectInvite = false;
        context.errors = null;
        const {searchString} = data;
        context.searchString = searchString;

        if (searchString.length < BoardStoreConstants.MinUserNameSearchLength) {
            context.users = this._storage.get('invited_members').map((member) => {
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
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }

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
        if (SettingsStore.isOffline()) {
            this._storage.get('card-popup').errors = ConstantMessages.OfflineMessage;
            return;
        }
        this._storage.get('card-popup').errors = null;

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

    /**
     * Загружает файл вложения
     * @param {Object} data данные
     * @private
     */
    async _uploadAttachment(data) {
        const cardContext = this._storage.get('card-popup');
        if (SettingsStore.isOffline()) {
            cardContext.errors = ConstantMessages.OfflineMessage;
            return;
        }
        cardContext.errors = null;
        if (data.file.size > BoardStoreConstants.MaxAttachmentSize) {
            cardContext.errors = ConstantMessages.AttachmentSizeTooBig;
            return;
        }

        const attachmentForm = new FormData();
        attachmentForm.append('attachment', data.file);

        let payload;

        try {
            payload = await Network.uploadAttachment(attachmentForm, cardContext.cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const card = this._getCardById(cardContext.clid, cardContext.cid);
            card.attachments.push(payload.data);
            return;

        case HttpStatusCodes.TooLarge:
            cardContext.errors = ConstantMessages.TooLargeMessage;
            return;

        default:
            cardContext.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Удаляет файл вложения
     * @param {Object} data данные
     * @private
     */
    async _deleteAttachment(data) {
        const cardContext = this._storage.get('card-popup');
        if (SettingsStore.isOffline()) {
            cardContext.errors = ConstantMessages.OfflineMessage;
            return;
        }

        let payload;

        try {
            payload = await Network.deleteAttachment(data.atid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const attachment = cardContext.attachments.find((attach) => {
                return attach.atid === data.atid;
            });
            cardContext.attachments.splice(cardContext.attachments.indexOf(attachment), 1);
            return;

        default:
            cardContext.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Скачивает файл вложения
     * @param {Object} data данные
     * @private
     */
    _downloadAttachment(data) {
        const cardContext = this._storage.get('card-popup');
        const attachment = cardContext.attachments.find((attach) => {
            return attach.atid === data.atid;
        });
        console.log('attachment.file_tech_name: ' + attachment.file_tech_name);
        window.open(ServiceWorker.ATTACHMENT_PREFIX + attachment.file_tech_name +
            `?${ServiceWorker.ATTACH_NAME_PARAM}=${attachment.file_pub_name}`,
                    `Download: ${attachment.file_pub_name}`);
    }

    /**
     * Приглашает пользователя в доску
     * @param {Object} data инвайт
     * @return {Promise<void>}
     */
    async _openBoardInvite(data) {
        let payload;

        try {
            payload = await Network.useBoardInvite(data.accessPath);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            Router.go(`/board/${payload.data.bid}`, true);
            return;

        default:
            Router.go(Urls.Login, true);
            return;
        }
    }

    /**
     * Приглашает пользователя в карточку
     * @param {Object} data инвайт
     * @return {Promise<void>}
     */
    async _openCardInvite(data) {
        let payload;

        try {
            payload = await Network.useCardInvite(data.accessPath);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            Router.go(`/board/${payload.data.bid}`, true);
            return;

        default:
            Router.go(Urls.Login, true);
            return;
        }
    }

    /**
     * Обновляет приглашение на доску
     * @return {Promise<void>}
     */
    async _refreshBoardInvite() {
        const context = this._storage.get('add-board-member-popup');
        context.errors = null;

        let payload;

        try {
            payload = await Network.refreshBoardInvite(this._storage.get('bid'));
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._setBoardInvite(payload.data.access_path);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Обновляет приглашение на карточку
     * @return {Promise<void>}
     */
    async _refreshCardInvite() {
        const context = this._storage.get('add-card-member-popup');
        context.errors = null;

        let payload;

        try {
            payload = await Network.refreshCardInvite(this._storage.get('card-popup').cid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            this._setCardInvite(payload.data.access_path);
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Скопировать приглашение на доску
     */
    async _copyBoardInvite() {
        const context = this._storage.get('add-board-member-popup');
        context.errors = null;

        try {
            await navigator.clipboard.writeText(context.inviteLink);
        } catch (error) {
            context.errors = ConstantMessages.CantCopyToClipBoard;
        }

        context.selectInvite = true;
    }

    /**
     * Скопировать приглашение на карточку
     */
    async _copyCardInvite() {
        const context = this._storage.get('add-card-member-popup');
        context.errors = null;

        try {
            await navigator.clipboard.writeText(context.inviteLink);
        } catch (error) {
            context.errors = ConstantMessages.CantCopyToClipBoard;
        }

        context.selectInvite = true;
    }

    /**
     * Отображает окно со списком тегов, при нажатии на кнопку тегов на доске
     * @private
     */
    _showTagListPopUpBoard() {
        const context = this._storage.get('tags-list-popup');
        context.visible = true;
        context.toggle_mode = false;
        context.errors = null;
    }

    /**
     * Отображает окно со списком тегов, при нажатии на кнопку добавить тег на карточке
     */
    _showTagListPopUpCard() {
        const context = this._storage.get('tags-list-popup');
        const currentCard = this._getCardById(this._storage.get('card-popup').clid,
                                              this._storage.get('card-popup').cid);
        context.visible = true;
        context.toggle_mode = true;
        context.errors = null;
        /* Отметим теги указанные для текущей карточки */
        context.tags.forEach((tag) => {
            tag.selected = !!currentCard.tags.find((cardTag) => {
                return cardTag.tgid === tag.tgid;
            });
        });
    }

    /**
     * Скрывает окно со списком тегов
     */
    _hideTagListPopUp() {
        const context = this._storage.get('tags-list-popup');
        context.visible = false;
        context.toggle_mode = false;
        context.errors = null;
    }

    /**
     * Отображает окно редактирования тега
     * @param {Object} data данные
     */
    _showTagEditPopUp(data) {
        const context = this._storage.get('tag-popup');
        const currentTag = this._getTagById(data.tgid);
        context.visible = true;
        context.errors = null;
        context.edit = true;
        context.tgid = data.tgid;
        context.picked_color = currentTag.color.clrid;
        context.tag_name = currentTag.tag_name;
        /* Отметим текущий цвет тега */
        context.colors.forEach((color) => {
            color.selected = (color.clrid === currentTag.color.clrid);
        });
    }

    /**
     * Отображает окно создания тега
     */
    _showTagCreatePopUp() {
        const context = this._storage.get('tag-popup');
        context.visible = true;
        context.errors = null;
        context.edit = false;
        context.picked_color = context.colors[Math.floor(Math.random() * (context.colors.length))].clrid;
        context.tag_name = null;
        /* Отметим текущий цвет тега */
        context.colors.forEach((color) => {
            color.selected = (color.clrid === context.picked_color);
        });
        console.log(context.colors);
    }

    /**
     * Скрывает окно тега
     */
    _hideTagPopUp() {
        const context = this._storage.get('tag-popup');
        context.visible = false;
        context.errors = null;
        context.edit = false;
    }

    /**
     * Создает тег
     * @param {Object} data данные c названием тега
     */
    async _createTag(data) {
        const contextTagPopUp = this._storage.get('tag-popup');
        const contextTagListPopUp = this._storage.get('tags-list-popup');

        if (SettingsStore.isOffline()) {
            contextTagPopUp.errors = ConstantMessages.OfflineMessage;
            return;
        }
        contextTagPopUp.errors = null;
        const validator = new Validator();
        contextTagPopUp.errors = validator.validateTagTitle(contextTagPopUp.tag_name);
        if (contextTagPopUp.errors) {
            return;
        }

        let payload;

        const newTagNetwork = {
            bid: this._storage.get('bid'),
            tag_name: contextTagPopUp.tag_name,
            color: {
                clrid: contextTagPopUp.picked_color,
            },
        };

        try {
            payload = await Network.createTag(newTagNetwork);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const color = this._getTagColorById(contextTagPopUp.picked_color);
            const newTag = {
                tgid: payload.data.tgid,
                tag_name: contextTagPopUp.tag_name,
                selected: false,
                color: {
                    color_name: color.color_name,
                    clrid: color.clrid,
                },
            };
            contextTagListPopUp.tags.push(newTag);
            this._hideTagPopUp();
            return;

        case HttpStatusCodes.BadRequest:
            contextTagPopUp.errors = ConstantMessages.UnsuccessfulRequest + ' (400)';
            return;

        default:
            contextTagPopUp.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Удаляет текущий тег
     */
    async _deleteTag() {
        const contextTagPopUp = this._storage.get('tag-popup');
        const contextTagListPopUp = this._storage.get('tags-list-popup');

        let payload;

        try {
            payload = await Network.deleteTag(contextTagPopUp.tgid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            /* Удалим из карточек */
            this._storage.get('card_lists').forEach((cardlist) => {
                cardlist.cards.forEach((card) => {
                    card.tags.splice(contextTagListPopUp.tags.indexOf(
                        this._getTagById(contextTagPopUp.tgid)), 1);
                });
            });
            /* Удалим из списка тегов */
            contextTagListPopUp.tags.splice(contextTagListPopUp.tags.indexOf(
                this._getTagById(contextTagPopUp.tgid)), 1);
            this._hideTagPopUp();
            return;

        case HttpStatusCodes.BadRequest:
            contextTagPopUp.errors = ConstantMessages.UnsuccessfulRequest + ' (400)';
            return;

        default:
            contextTagPopUp.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Обновляет тег
     */
    async _updateTag() {
        const context = this._storage.get('tag-popup');
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }

        context.errors = null;
        const validator = new Validator();
        context.errors = validator.validateTagTitle(context.tag_name);
        if (context.errors) {
            return;
        }

        const color = this._getTagColorById(context.picked_color);

        let payload;

        const updatedTag = {
            bid: this._storage.get('bid'),
            tag_name: context.tag_name,
            color: {
                clrid: color.clrid,
            },
        };

        try {
            payload = await Network.updateTag(updatedTag, context.tgid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const tag = this._getTagById(context.tgid);
            tag.tag_name = context.tag_name;
            tag.color.clrid = color.clrid;
            tag.color.color_name = color.color_name;
            this._hideTagPopUp();
            return;

        case HttpStatusCodes.BadRequest:
            context.errors = ConstantMessages.UnsuccessfulRequest + ' (400)';
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Переключает тег у карточки
     * @param {Object} data данные
     */
    async _toggleTag(data) {
        const context = this._storage.get('tags-list-popup');
        const currentCard = this._getCardById(this._storage.get('card-popup').clid,
                                              this._storage.get('card-popup').cid);
        if (SettingsStore.isOffline()) {
            context.errors = ConstantMessages.OfflineMessage;
            return;
        }

        let payload;

        try {
            payload = await Network.toggleCardTag(this._storage.get('card-popup').cid,
                                                  data.tgid);
        } catch (error) {
            console.log('Unable to connect to backend, reason: ', error);
            return;
        }

        switch (payload.status) {
        case HttpStatusCodes.Ok:
            const tagPopUp = context.tags.find((tag) => {
                return tag.tgid === data.tgid;
            });
            tagPopUp.selected = !tagPopUp.selected;

            if (tagPopUp.selected) {
                currentCard.tags.push(tagPopUp);
            } else {
                currentCard.tags.splice(currentCard.tags.indexOf(currentCard.tags.find((tag) => {
                    return tag.tgid === data.tgid;
                })), 1);
            }

            return;

        case HttpStatusCodes.BadRequest:
            context.errors = ConstantMessages.UnsuccessfulRequest + ' (400)';
            return;

        default:
            context.errors = ConstantMessages.UnsuccessfulRequest;
            return;
        }
    }

    /**
     * Выбирает цвет для текущего, редактируемого тега
     * @param {Object} data данные
     */
    _pickColor(data) {
        const context = this._storage.get('tag-popup');
        context.picked_color = data.clrid;
        context.colors.forEach((color) => {
            color.selected = (color.clrid === context.picked_color);
        });
    }

    /**
     * Обновляет в сторе редактируемое имя тега
     * @param {Object} data данные c название тега
     */
    _editTagName(data) {
        const context = this._storage.get('tag-popup');
        context.tag_name = data.tag_name;
    }
}

export default new BoardStore();
