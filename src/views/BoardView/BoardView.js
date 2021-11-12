// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {boardsActions} from '../../actions/boards.js';
import {boardActions} from '../../actions/board';
import {cardListActions} from '../../actions/cardlist';
import {cardActions} from '../../actions/card.js';

// Components
import CardListComponent from '../../components/CardList/CardList.js';

// Popups
import BoardSettingPopUp from '../../popups/BoardSetting/BoardSettingPopUp.js';
import CardListPopUp from '../../popups/CardList/CardListPopUp.js';
import CardPopUp from '../../popups/Card/CardPopUp.js';
import DeleteCardListPopUp from '../../popups/DeleteCardList/DeleteCardListPopUp.js';
import DeleteCardPopUp from '../../popups/DeleteCard/DeleteCardPopUp.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';
import BoardStore from '../../stores/BoardStore/BoardStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router.js';

// Constants
import {Urls} from '../../constants/constants.js';

// Стили
import './BoardView.scss';

// Шаблон
import template from './BoardView.hbs';

/**
 * Класс, реализующий страницу доски.
 */
export default class BoardView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent) {
        const context = new Map([...UserStore.getContext(), ...BoardStore.getContext(),
            ...SettingsStore.getContext()]);
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

        this.registerViewElements();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     * @param {Object} urlData параметры адресной строки
     */
    _onShow(urlData) {
        this.urlData = urlData;
        boardsActions.getBoard(urlData.pathParams.id);
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this.removeComponentsList('_cardlists');

        this._setContext(new Map([...UserStore.getContext(), ...BoardStore.getContext(),
            ...SettingsStore.getContext()]));

        if (!this._isActive) {
            return;
        }

        this.context.get('card_lists')?.forEach((cardlist) => {
            this.addComponentToList('_cardlists', new CardListComponent(cardlist));
        });

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     */
    render() {
        /* Если пользователь авторизован, то перебросить его на страницу входа */
        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }
        this._isActive = true;

        super.render();

        this.registerViewElements();

        this.addEventListeners();
    }

    /**
     * Метод, сохраняющий ссылки на поля и кнопки
     */
    registerViewElements() {
        this._elements = {
            showSettingBtn: document.getElementById('showBoardSettingPopUpId'),
            showCreateCLBtn: document.getElementById('showCreateCardListPopUpId'),
            cardLists: {
                addCardBtns: document.querySelectorAll('.addCardToCardList'),
                editBtns: document.querySelectorAll('.editCardList'),
                deleteBtns: document.querySelectorAll('.deleteCardList'),
            },
            cards: {
                editAreas: document.querySelectorAll('.editCard'),
                deleteBtns: document.querySelectorAll('.deleteCard'),
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
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        this._elements.showSettingBtn?.addEventListener('click', this._onShowSettingPopUp);
        this._elements.showCreateCLBtn?.addEventListener('click', this._onShowCreateCLPopUp);
        this._elements.cardLists.addCardBtns.forEach((addCardBtn)=>{
            addCardBtn.addEventListener('click', this._onAddCardToCardList);
        });
        this._elements.cardLists.editBtns.forEach((editCardListBtn)=>{
            editCardListBtn.addEventListener('click', this._onEditCardList);
        });
        this._elements.cardLists.deleteBtns.forEach((deleteCardListBtn)=>{
            deleteCardListBtn.addEventListener('click', this._onDeleteCardList);
        });
        this._elements.cards.editAreas.forEach((editArea)=>{
            editArea.addEventListener('click', this._onEditCard);
        });
        this._elements.cards.deleteBtns.forEach((deleteCardBtn)=>{
            deleteCardBtn.addEventListener('click', this._onDeleteCard);
        });
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.showSettingBtn?.removeEventListener('click', this._onShowSettingPopUp);
        this._elements.showCreateCLBtn?.removeEventListener('click', this._onShowCreateCLPopUp);
        this._elements.cardLists.addCardBtns.forEach((addCardBtn)=>{
            addCardBtn.removeEventListener('click', this._onAddCardToCardList);
        });
        this._elements.cardLists.editBtns.forEach((editCardListBtn)=>{
            editCardListBtn.removeEventListener('click', this._onEditCardList);
        });
        this._elements.cardLists.deleteBtns.forEach((deleteCardListBtn)=>{
            deleteCardListBtn.removeEventListener('click', this._onDeleteCardList);
        });
        this._elements.cards.editAreas.forEach((editArea)=>{
            editArea.removeEventListener('click', this._onEditCard);
        });
        this._elements.cards.deleteBtns.forEach((deleteCardBtn)=>{
            deleteCardBtn.removeEventListener('click', this._onDeleteCard);
        });
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
    _onAddCardToCardList(event) {
        cardActions.showCreateCardPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на кнопку редактирования списка карточек
     * @param {Event} event объект события
     * @private
     */
    _onEditCardList(event) {
        cardListActions.showEditCardListPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на значек удаления списка карточек
     * @param {Event} event объект события
     * @private
     */
    _onDeleteCardList(event) {
        cardListActions.showDeleteCardListPopUp(parseInt(event.target.dataset.id, 10));
    }

    /**
     * Метод вызывается при нажатии на кнопку редактирования карточки
     * @param {Event} event объект события
     * @private
     */
    _onEditCard(event) {
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
    _onDeleteCard(event) {
        cardActions.showDeleteCardPopUp(
            parseInt(event.target.closest('.column__content').dataset.id, 10),
            parseInt(event.target.dataset.id, 10),
        );
        event.stopPropagation();
    }
}
