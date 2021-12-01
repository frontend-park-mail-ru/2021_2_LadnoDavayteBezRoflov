// Базовый компонент
import {userActions} from '../../actions/user.js';
import BaseComponent from '../BaseComponent.js';

// Стили
import './Navbar.scss';

import UserStore from '../../stores/UserStore/UserStore.js';

// Шаблон
import template from './Navbar.hbs';
import {settingsActions} from '../../actions/settings';
import {SettingStoreConstants} from '../../constants/constants';


/**
 * Класс, реализующий компонент Navbar.
 */
export default class NavbarComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Navbar.
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, template);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);

        this._elements = {};
        this._bindCallBacks();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении компонента.
     */
    _onRefresh() {
        this.context = UserStore.getContext();
    }

    /**
     * Метод биндит callback'и к this
     * @private
     */
    _bindCallBacks() {
        this._logout = this._logout.bind(this);
        this._onHamburgerClick = this._onHamburgerClick.bind(this);
    }

    /**
     * Метод сохраняет элементы DOM связанные с navbar
     * @private
     */
    _registerElements() {
        this._elements = {
            logOutBtn: document.getElementById('logout'),
            hamburgerBtn: document.getElementById('hamburgerBtnId'),
        };
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
        this._registerElements();
        this._elements.logOutBtn?.addEventListener('click', this._logout);
        this._elements.hamburgerBtn?.addEventListener('click', this._onHamburgerClick);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        this._elements.logOutBtn?.removeEventListener('click', this._logout);
        this._elements.hamburgerBtn?.removeEventListener('click', this._onHamburgerClick);
    }

    /**
     * Метод, посылающий действие "выход".
     * @param {*} event
     */
    _logout(event) {
        event.preventDefault();
        userActions.logout();
    }

    /**
     * Метод, срабатывающий при клике на кнопку меню
     * @private
     */
    _onHamburgerClick() {
        const links = document.querySelector('.navbar__links');
        if (links && this.context.get('navbar').is) {
            links.style.display = 'flex';
        }
        settingsActions.toggleNavbarMenu();
    }
}
