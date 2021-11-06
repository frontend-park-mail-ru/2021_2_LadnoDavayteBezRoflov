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
import './board.scss';

// Шаблон
import template from './BoardView.hbs';

import './BoardView.scss';

/**
  * Класс, реализующий страницу доски.
  */
export default class BoardView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
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
            console.log(cardlist);
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

        this.addEventListeners();

        this.registerInputElements();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        document.getElementById('addCardList').addEventListener('click', this.addCardListCallback);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('addCardList')?.removeEventListener('click', this.addCardListCallback);
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        this._inputElements.title = document.getElementById('title');
        this._inputElements.description = document.getElementById('description');
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
}
