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

        this._bindCallBacks();
        UserStore.addListener(this._onRefresh); // + field
        BoardStore.addListener(this._onRefresh);

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

        // todo карточки и так массивом идут
        Object.values(this.context.get('card_lists')).forEach((cardlist) => {
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
     * Метод, сохраняющий ссылки на поля и кнопки
     */
    registerViewElements() {
        this._elements = {
            showSettingBtn: document.getElementById('showBoardSettingPopUpId'),
            showCreateCLBtn: document.getElementById('addCardListId'),
        };
    }

    /**
     * Метод биндит контекст this к calllback'ам
     * @private
     */
    _bindCallBacks() {
        this._onRefresh = this._onRefresh.bind(this);
        this._onShowSettingPopUp = this._onShowSettingPopUp.bind(this);
        this._onShowCreateCLPopUp = this._onShowCreateCLPopUp.bind(this);
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        this._elements.showSettingBtn?.addEventListener('click', this._onShowSettingPopUp);
        this._elements.showCreateCLBtn?.addEventListener('click', this._onShowCreateCLPopUp);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.showSettingBtn?.removeEventListener('click', this._onShowSettingPopUp);
        this._elements.showCreateCLBtn?.removeEventListener('click', this._onShowCreateCLPopUp);
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
        boardActions.showCardListPopUp();
    }
}
