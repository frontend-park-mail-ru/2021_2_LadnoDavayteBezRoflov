// Базовая страница
import BaseView from '../BaseView';

// Actions
import {boardsActions} from '../../actions/boards';
import {boardActions} from '../../actions/board';
import {cardListActions} from '../../actions/cardlist';
import {cardActions} from '../../actions/card';

// Components
import CardListComponent from '../../components/CardList/CardList';

// Popups
import BoardSettingPopUp from '../../popups/BoardSetting/BoardSettingPopUp';
import CardListPopUp from '../../popups/CardList/CardListPopUp';
import CardPopUp from '../../popups/Card/CardPopUp';
import DeleteCardListPopUp from '../../popups/DeleteCardList/DeleteCardListPopUp';
import DeleteCardPopUp from '../../popups/DeleteCard/DeleteCardPopUp';
import AddUserPopUp from '../../popups/AddUser/AddUserPopUp';
import TagsListPopUp from '../../popups/TagsList/TagsListPopUp';
import TagPopUp from '../../popups/Tag/TagPopUp';

// Stores
import UserStore from '../../stores/UserStore/UserStore';
import BoardStore from '../../stores/BoardStore/BoardStore';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router';

// Constants
import {Urls} from '../../constants/constants';

// Стили
import './BoardView.scss';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './BoardView.hbs' or its corres... Remove this comment to see the full error message
import template from './BoardView.hbs';
import {inviteActions} from '../../actions/invite';
import {tagsActions} from '../../actions/tags';

/**
 * Класс, реализующий страницу доски.
 */
export default class BoardView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent: any) {
        const context = new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...BoardStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...SettingsStore.getContext(),
        ]);
        super(context, template, parent);

        this._bindCallBacks();
        UserStore.addListener(this._onRefresh); // + field
        BoardStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);

        // Добавить попапы
        this.addComponent('BoardSettingPopUp', new BoardSettingPopUp());
        this.addComponent('CardListPopUp', new CardListPopUp());
        this.addComponent('CardPopUp', new CardPopUp());
        this.addComponent('DeleteCardListPopUp', new DeleteCardListPopUp());
        this.addComponent('DeleteCardPopUp', new DeleteCardPopUp());
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_addUserCallBacks' does not exist on typ... Remove this comment to see the full error message
        this.addComponent('AddBoardMemberPopUp', new AddUserPopUp(this._addUserCallBacks.board));
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_addUserCallBacks' does not exist on typ... Remove this comment to see the full error message
        this.addComponent('AddCardMemberPopUp', new AddUserPopUp(this._addUserCallBacks.card));
        this.addComponent('TagsListPopUp', new TagsListPopUp());
        this.addComponent('TagPopUp', new TagPopUp());

        this._setContextByComponentName('AddBoardMemberPopUp',
                                        BoardStore.getContext('add-board-member-popup'));
        this._setContextByComponentName('AddCardMemberPopUp',
                                        BoardStore.getContext('add-card-member-popup'));
        this.registerViewElements();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     * @param {Object} urlData параметры адресной строки
     */
    // @ts-expect-error ts-migrate(2416) FIXME: Property '_onShow' in type 'BoardView' is not assi... Remove this comment to see the full error message
    _onShow(urlData: any) {
        if (!UserStore.getContext('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }

        if ('accessPathBoard' in urlData.pathParams) {
            inviteActions.openBoardInvite(urlData.pathParams.accessPathBoard);
        } else if ('accessPathCard' in urlData.pathParams) {
            inviteActions.openCardInvite(urlData.pathParams.accessPathCard);
        } else {
            boardsActions.getBoard(urlData.pathParams.id);
        }

        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this.removeComponentsList('_cardlists');

        this._setContext(new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...BoardStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...SettingsStore.getContext(),
        ]));
        this._setContextByComponentName('AddBoardMemberPopUp',
                                        BoardStore.getContext('add-board-member-popup'));
        this._setContextByComponentName('AddCardMemberPopUp',
                                        BoardStore.getContext('add-card-member-popup'));

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Board... Remove this comment to see the full error message
        if (!this._isActive) {
            return;
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BoardVi... Remove this comment to see the full error message
        this.context.get('card_lists')?.forEach((cardlist: any) => {
            this.addComponentToList('_cardlists', new CardListComponent(cardlist));
        });

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     */
    render() {
        /* Если пользователь авторизован, то перебросить его на страницу входа */
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'BoardVi... Remove this comment to see the full error message
        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Board... Remove this comment to see the full error message
        this._isActive = true;

        super.render();

        this.registerViewElements();

        this.addEventListeners();
    }

    /**
     * Метод, сохраняющий ссылки на поля и кнопки
     */
    registerViewElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements = {
            showSettingBtn: document.getElementById('showBoardSettingPopUpId'),
            showCreateCLBtn: document.getElementById('showCreateCardListPopUpId'),
            addMembersBtn: document.getElementById('showAddBoardMemberPopUpId'),
            showTagsBtn: document.getElementById('showTagsBoardPopUpId'),
            cardLists: {
                dragAreas: document.querySelectorAll('.dragCardList'),
                addCardBtns: document.querySelectorAll('.addCardToCardList'),
                editBtns: document.querySelectorAll('.editCardList'),
                deleteBtns: document.querySelectorAll('.deleteCardList'),
                cardListsDropZones: document.querySelectorAll('.cardListDropZone'),
            },
            cards: {
                dragAreas: document.querySelectorAll('.dragCard'),
                editAreas: document.querySelectorAll('.editCard'),
                deleteBtns: document.querySelectorAll('.deleteCard'),
                checkDeadlineCardBtns: document.querySelectorAll('.checkDeadlineCard'),
                cardDropZones: document.querySelectorAll('.cardDropZone'),
            },
        };
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._onRefresh = this._onRefresh.bind(this);
        /* Board */
        this._onShowSettingPopUp = this._onShowSettingPopUp.bind(this);
        this._onShowCreateCLPopUp = this._onShowCreateCLPopUp.bind(this);
        /* Card Lists */
        this._onAddCardToCardList = this._onAddCardToCardList.bind(this);
        this._onEditCardList = this._onEditCardList.bind(this);
        this._onDeleteCardList = this._onDeleteCardList.bind(this);
        /* Cards */
        this._onDeleteCard = this._onDeleteCard.bind(this);
        this._onEditCard = this._onEditCard.bind(this);
        /* Add User PopUps */
        this._onAddCardMemberInput = this._onAddCardMemberInput.bind(this);
        this._onAddCardMemberUserClick = this._onAddCardMemberUserClick.bind(this);
        this._onAddCardMemberClose = this._onAddCardMemberClose.bind(this);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_addUserCallBacks' does not exist on typ... Remove this comment to see the full error message
        this._addUserCallBacks = {
            card: {
                onInput: this._onAddCardMemberInput.bind(this),
                onUserClick: this._onAddCardMemberUserClick.bind(this),
                onClose: this._onAddCardMemberClose.bind(this),
                onRefreshInvite: this._onRefreshCardInvite.bind(this),
                onCopyInvite: this._onCopyCardInvite.bind(this),
            },
            board: {
                onInput: this._onAddBoardMemberInput.bind(this),
                onUserClick: this._onAddBoardMemberUserClick.bind(this),
                onClose: this._onAddBoardMemberClose.bind(this),
                onRefreshInvite: this._onRefreshBoardInvite.bind(this),
                onCopyInvite: this._onCopyBoardInvite.bind(this),
            },
        };
        this._onAddBoardMemberShow = this._onAddBoardMemberShow.bind(this);
        /* DnD */
        this._onCardDrop = this._onCardDrop.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onShowTagListPopUpBoard = this._onShowTagListPopUpBoard.bind(this);
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     * @register show add members
     */
    addEventListeners() {
        super.addEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showSettingBtn?.addEventListener('click', this._onShowSettingPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showCreateCLBtn?.addEventListener('click', this._onShowCreateCLPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.addMembersBtn?.addEventListener('click', this._onAddBoardMemberShow);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.addCardBtns.forEach((addCardBtn: any) => {
            addCardBtn.addEventListener('click', this._onAddCardToCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.editBtns.forEach((editCardListBtn: any) => {
            editCardListBtn.addEventListener('click', this._onEditCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.deleteBtns.forEach((deleteCardListBtn: any) => {
            deleteCardListBtn.addEventListener('click', this._onDeleteCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.editAreas.forEach((editArea: any) => {
            editArea.addEventListener('click', this._onEditCard);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.deleteBtns.forEach((deleteCardBtn: any) => {
            deleteCardBtn.addEventListener('click', this._onDeleteCard);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.checkDeadlineCardBtns.forEach((checkDeadlineCardBtn: any) => {
            checkDeadlineCardBtn.addEventListener('click', this._onCheckDeadlineCard);
        });
        /* DnD: card */
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.cardDropZones.forEach((cardDropZone: any) => {
            cardDropZone.addEventListener('drop', this._onCardDrop);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.addEventListener('dragover', this._onDragOver);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.dragAreas.forEach((dragArea: any) => {
            dragArea.addEventListener('dragstart', this._onCardDrag);
        });
        /* DnD: cardList */
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.addEventListener('drop', this._onCardListDrop);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.addEventListener('dragover', this._onDragOver);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.dragAreas.forEach((dragArea: any) => {
            dragArea.addEventListener('dragstart', this._onCardListDrag);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showTagsBtn?.addEventListener('click', this._onShowTagListPopUpBoard);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showSettingBtn?.removeEventListener('click', this._onShowSettingPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showCreateCLBtn?.removeEventListener('click', this._onShowCreateCLPopUp);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.addMembersBtn?.removeEventListener('click', this._onAddBoardMemberShow);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.addCardBtns.forEach((addCardBtn: any) => {
            addCardBtn.removeEventListener('click', this._onAddCardToCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.editBtns.forEach((editCardListBtn: any) => {
            editCardListBtn.removeEventListener('click', this._onEditCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.deleteBtns.forEach((deleteCardListBtn: any) => {
            deleteCardListBtn.removeEventListener('click', this._onDeleteCardList);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.editAreas.forEach((editArea: any) => {
            editArea.removeEventListener('click', this._onEditCard);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.deleteBtns.forEach((deleteCardBtn: any) => {
            deleteCardBtn.removeEventListener('click', this._onDeleteCard);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.checkDeadlineCardBtns.forEach((checkDeadlineCardBtn: any) => {
            checkDeadlineCardBtn.removeEventListener('click', this._onCheckDeadlineCard);
        });
        /* DnD: card */
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.cardDropZones.forEach((cardDropZone: any) => {
            cardDropZone.removeEventListener('drop', this._onCardDrop);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.removeEventListener('dragover', this._onDragOver);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cards.dragAreas.forEach((dragArea: any) => {
            dragArea.removeEventListener('dragstart', this._onCardDrag);
        });
        /* DnD: cardList */
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.removeEventListener('drop', this._onCardListDrop);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.cardListsDropZones.forEach((cardListDropZone: any) => {
            cardListDropZone.removeEventListener('dragover', this._onDragOver);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.cardLists.dragAreas.forEach((dragArea: any) => {
            dragArea.removeEventListener('dragstart', this._onCardListDrag);
        });
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Board... Remove this comment to see the full error message
        this._elements.showTagsBtn?.removeEventListener('click', this._onShowTagListPopUpBoard);
    }

    /**
     * Callback, срабатывающий при нажатии на кнопку "Настройки"
     * @private
     */
    _onShowSettingPopUp() {
        boardActions.showBoardSettingsPopUp();
    }

    /**
     * Callback, срабатывающий при нажатии на кнопку "Добавить список"
     * @private
     */
    _onShowCreateCLPopUp() {
        cardListActions.showCreateCardListPopUp();
    }

    /**
     * Метод вызывается при нажатии на "+"
     * @param {Event} event объект события
     * @private
     */
    _onAddCardToCardList(event: any) {
        cardActions.showCreateCardPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на кнопку редактирования списка карточек
     * @param {Event} event объект события
     * @private
     */
    _onEditCardList(event: any) {
        cardListActions.showEditCardListPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на значек удаления списка карточек
     * @param {Event} event объект события
     * @private
     */
    _onDeleteCardList(event: any) {
        cardListActions.showDeleteCardListPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на кнопку редактирования карточки
     * @param {Event} event объект события
     * @private
     */
    _onEditCard(event: any) {
        cardActions.showEditCardPopUp(
            parseInt(event.target.closest('.column__content').dataset.id, 10),
            parseInt(event.target.dataset.id, 10),
        );
    }

    /**
     * Метод вызывается при нажатии на значок удаления карточки
     * @param {Event} event объект события
     * @private
     */
    _onDeleteCard(event: any) {
        cardActions.showDeleteCardPopUp(
            parseInt(event.target.closest('.column__content').dataset.id, 10),
            parseInt(event.target.dataset.id, 10),
        );
        event.stopPropagation();
    }

    /**
     * Метод вызывается при нажатии на значок дедлайна
     * @param {Event} event объект события
     * @private
     */
    _onCheckDeadlineCard(event: any) {
        cardActions.updateDeadlineCard(
            parseInt(event.target.closest('.column__content').dataset.id, 10),
            parseInt(event.target.dataset.id, 10),
        );
        event.stopPropagation();
    }


    /**
     * Callback вызывается при вводе текста в input поиска пользователя для карточки
     * @param {Event} event объект события
     * @private
     */
    _onAddCardMemberInput(event: any) {
        cardActions.refreshUserSearchList(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатие на строку с пользователем
     * @param {Event} event - объект события
     * @private
     */
    _onAddCardMemberUserClick(event: any) {
        const user = event.target.closest('div.search-result');
        cardActions.toggleUserInSearchList(parseInt(user.dataset.uid, 10));
    }

    /**
     * Callback, вызываемый при закрытии окна добавления пользователя в карточку
     * @param {Event} event объект события
     * @private
     */
    _onAddCardMemberClose(event: any) {
        if (event.target.id === 'addUserPopUpCloseId' ||
            event.target.id === 'addUserPopUpWrapperId') {
            cardActions.hideAddCardAssigneePopUp();
        }
    }

    /**
     * Callback вызывается при вводе текста в input поиска пользователя для доски
     * @param {Event} event объект события
     * @private
     */
    _onAddBoardMemberInput(event: any) {
        boardActions.refreshUserSearchList(event.target.value);
    }

    /**
     * Callback, вызываемый при нажатие на строку с пользователем в AddBoardMemberPopUp
     * @param {Event} event - объект события
     * @private
     */
    _onAddBoardMemberUserClick(event: any) {
        const user = event.target.closest('div.search-result');
        boardActions.toggleUserInSearchList(parseInt(user.dataset.uid, 10));
    }

    /**
     * Callback, вызываемый при нажатии "Пригласить"
     * @param {Event} event - объект события
     * @private
     */
    _onAddBoardMemberShow(event: any) {
        event.preventDefault();
        boardActions.showAddBoardMemberPopUp();
    }

    /**
     * Callback, вызываемый при закрытии окна добавления пользователя в доску
     * @param {Event} event объект события
     * @private
     */
    _onAddBoardMemberClose(event: any) {
        if (event.target.id === 'addUserPopUpCloseId' ||
            event.target.id === 'addUserPopUpWrapperId') {
            boardActions.hideAddBoardMemberPopUp();
        }
    }

    /**
     * Callback, вызываемый при перемещении карточки
     * @param {Event} event - объект события
     * @private
     */
    _onCardDrop(event: any) {
        event.preventDefault();
        const data = event.dataTransfer.getData('brr/card');
        const clidPrev = parseInt(event.dataTransfer.getData('brr/card/cardList'), 10);
        if (data && clidPrev) {
            try {
                const element = document.querySelector(`.card [data-id="${data}"]`);
                const cardElement = event.target.closest('.card');
                const target = event.target.closest('.cardDropZone');

                target.insertBefore(element, cardElement);

                const position = Array.from(target.children).findIndex((card) =>
                    // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
                    card.attributes.getNamedItem('data-id').value === element.dataset.id);
                if (position === -1) {
                    throw new Error(`BoardView: карточка ${data} не найдена`);
                }
                const card = BoardStore._getCardById(clidPrev, parseInt(data, 10));

                card.cid = parseInt(data, 10);
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                card.clid = parseInt(element.closest('.cardDropZone').dataset.id, 10);
                card.pos = position + 1;
                card.clidPrev = clidPrev;

                cardActions.updateCard(
                    card,
                );
            } catch (error) {
                throw new Error(`BoardView: не получилось переместить карточку (причина: ${error})`);
            }
        }
    }

    /**
     * Callback, вызываемый при завершении D&D
     * @param {Event} event - объект события
     * @private
     */
    _onDragOver(event: any) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.target.style.opacity = 1;
        event.target.style.transform = 'translate(0, 0)';
    }

    /**
     * Callback, вызываемый при перетаскивании карточки
     * @param {Event} event - объект события
     * @private
     */
    _onCardDrag(event: any) {
        event.dataTransfer.setData('brr/card', event.target.closest('.card').dataset.id);
        event.dataTransfer.setData('brr/card/cardList',
                                   event.target.closest('.cardDropZone').dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        event.target.style.opacity = 0.6;
        event.target.style.transform = 'translate(10px, 10px)';
    }

    /**
     * Callback, вызываемый при перетаскивании колонки
     * @param {Event} event - объект события
     * @private
     */
    _onCardListDrag(event: any) {
        event.dataTransfer.setData('brr/cardList', event.target.closest('.column').dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        event.target.style.opacity = 0.6;
        event.target.style.transform = 'translate(10px, 10px)';
    }

    /**
     * Callback, вызываемый при перемещении колонки
     * @param {Event} event - объект события
     * @private
     */
    _onCardListDrop(event: any) {
        event.preventDefault();
        const data = event.dataTransfer.getData('brr/cardList');
        if (data && !event.dataTransfer.getData('brr/card')) {
            try {
                const element = document.querySelector(`.column [data-id="${data}"]`);
                const cardListElement = event.target.closest('.column');
                const target = event.target.closest('.cardListDropZone');

                target.insertBefore(element, cardListElement);

                const position = Array.from(target.children).findIndex((cardList) =>
                    // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
                    cardList.attributes.getNamedItem('data-id').value === element.dataset.id);
                if (position === -1) {
                    throw new Error(`BoardView: колонка ${data} не найдена`);
                }
                const cardList = BoardStore._getCardListById(parseInt(data, 10));

                cardListActions.updateCardList(
                    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    position + 1, cardList.cardList_name, parseInt(element.dataset.id, 10),
                );
            } catch (error) {
                throw new Error(`BoardView: не получилось переместить колонку (причина: ${error})`);
            }
        }
    }
    /**
     * Callback, вызываемый при обновлении ссылки приглашение на доску
     * @param {Event} event объект события
     * @private
     */
    _onRefreshBoardInvite(event: any) {
        event.preventDefault();
        inviteActions.refreshBoardInvite();
    }

    /**
     * Callback, вызываемый при обновлении ссылки приглашение на карточку
     * @param {Event} event объект события
     * @private
     */
    _onRefreshCardInvite(event: any) {
        event.preventDefault();
        inviteActions.refreshCardInvite();
    }

    /**
     * Callback, вызываемый при копировании приглашения на доску
     * @param {Event} event объект события
     * @private
     */
    _onCopyBoardInvite(event: any) {
        event.preventDefault();
        inviteActions.copyBoardInvite();
    }

    /**
     * Callback, вызываемый при копировании приглашения на карточку
     * @param {Event} event объект события
     * @private
     */
    _onCopyCardInvite(event: any) {
        event.preventDefault();
        inviteActions.copyCardInvite();
    }

    /**
     * CallBack на отображение тегов
     * @param {Event} event - объект события
     * @private
     */
    _onShowTagListPopUpBoard(event: any) {
        event.preventDefault();
        tagsActions.showTagListPopUpBoard();
    }
}
