// Базовый компонент
import {userActions} from '../../actions/user';
import BaseComponent from '../BaseComponent';

// Стили
import './Navbar.scss';

import UserStore from '../../stores/UserStore/UserStore';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './Navbar.hbs' or its correspon... Remove this comment to see the full error message
import template from './Navbar.hbs';
import {settingsActions} from '../../actions/settings';


/**
 * Класс, реализующий компонент Navbar.
 */
export default class NavbarComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Navbar.
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(context, template);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
        this._elements = {};
        this._bindCallBacks();
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении компонента.
     */
    _onRefresh() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'NavbarC... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
        this._elements.logOutBtn?.addEventListener('click', this._logout);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
        this._elements.hamburgerBtn?.addEventListener('click', this._onHamburgerClick);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
        this._elements.logOutBtn?.removeEventListener('click', this._logout);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Navba... Remove this comment to see the full error message
        this._elements.hamburgerBtn?.removeEventListener('click', this._onHamburgerClick);
    }

    /**
     * Метод, посылающий действие "выход".
     * @param {*} event
     */
    _logout(event: any) {
        event.preventDefault();
        userActions.logout();
    }

    /**
     * Метод, срабатывающий при клике на кнопку меню
     * @private
     */
    _onHamburgerClick() {
        const links = document.querySelector('.navbar__links');
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'NavbarC... Remove this comment to see the full error message
        if (links && this.context.get('navbar').is) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Element'.
            links.style.display = 'flex';
        }
        settingsActions.toggleNavbarMenu();
    }
}
