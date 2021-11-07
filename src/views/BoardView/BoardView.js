// Базовая страница
import BaseView from '../BaseView.js';

// Actions
import {userActions} from '../../actions/user.js';
import {boardsActions} from '../../actions/boards.js';

// Components
import CardListComponent from '../../components/CardList/CardList.js';

// Stores
import UserStore from '../../stores/UserStore/UserStore.js';
import BoardStore from '../../stores/BoardStore/BoardStore.js';

// Modules
import Router from '../../modules/Router/Router.js';

// Constants
import {Urls} from '../../constants/constants.js';

// Стили
import './BoardView.scss';

// Шаблон
import template from './BoardView.hbs';
import {boardActions} from '../../actions/board';

/**
 * Класс, реализующий страницу доски.
 */
export default class BoardView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     * @param {Element} popup HTML-элемент, в который будет осуществлена отрисовка popup
     */
    constructor(parent, popup) {
        const context = new Map([...UserStore.getContext(), ...BoardStore.getContext()]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        BoardStore.addListener(this._onRefresh);


        // this.formAuthorizationCallback = this.formAuthorization.bind(this);

        this._inputElements = {
            title: null,
            description: null,
        };

        this._bindCallBacks();
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

        this._setContext(new Map([...UserStore.getContext(), ...BoardStore.getContext()]));
        if (!this._isActive) {
            return;
        }

        Object.values(this.context.get('content')).forEach((cardlist) => {
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
            Router.go(Urls.Login);
            return;
        }
        this._isActive = true;

        super.render();

        this.registerViewElements();

        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        this._elements.setting.showBtn?.addEventListener('click', this._showSettingPopUp);
        // this._elements.cardList.showBtn.addEventListener('click', this._showCardListPopUp);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.setting.showBtn?.removeEventListener('click', this._showSettingPopUp);
        // this._elements.cardList.showBtn.removeEventListener('click', this._showCardListPopUp);
    }

    /**
     * Метод, сохраняющий ссылки на поля и кнопки
     */
    registerViewElements() {
        this._elements = {
            cardList: {
                showBtn: document.getElementById('addCardListPopUp'),
                hideBtn: document.getElementById('hideCardListPopUp'),
                title: document.getElementById('cardListTitle'),
                submit: document.getElementById('cardCreateCreate'),
            },
            setting: {
                showBtn: document.getElementById('showBoardSettingPopUp'),
                hideBtn: document.getElementById('hideBoardSettingPopUp'),
                title: document.getElementById('boardSetting'),
                description: document.getElementById('boardSetting'),
                deleteBtn: document.getElementById('boardSetting'),
                acceptBtn: document.getElementById('acceptDeleteBoard'),
                denyBtn: document.getElementById('denyDeleteBoard'),
            },
        };
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {object} event событие
     */
    formAuthorization(event) {
        event.preventDefault();

        const data = {
            login: this._inputElements.login.value,
            password: this._inputElements.password.value,
        };

        userActions.login(data.login, data.password);
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._showCardListPopUp = this._showCardListPopUp.bind(this);
        this._showInvitePopUp = this._showInvitePopUp.bind(this);
        this._showSettingPopUp = this._showSettingPopUp.bind(this);
    }

    _showSettingPopUp() {
        boardActions.showBoardSettingsPopUp();
    }

    _showCardListPopUp() {
    }

    _showInvitePopUp() {

    }


}
