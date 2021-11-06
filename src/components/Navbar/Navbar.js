// Базовый компонент
import {userActions} from '../../actions/user.js';
import BaseComponent from '../BaseComponent.js';

// Стили
import './Navbar.scss';

import UserStore from '../../stores/UserStore/UserStore.js';

// Шаблон
import template from './Navbar.hbs';

/**
 * Класс, реализующий компонент Navbar.
 */
export default class NavbarComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Navbar.
    * @param {function} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, {template}, undefined);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);


        this._logoutCallback = this._logout.bind(this);
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении компонента.
     */
    _onRefresh() {
        this.context = UserStore.getContext();
    }

    /**
     * Метод, добавляющий обработчики событий для компонента.
     */
    addEventListeners() {
        document.getElementById('logout')?.addEventListener('click', this._logoutCallback);
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
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        document.getElementById('logout')?.removeEventListener('click', this._logoutCallback);
    }
}
