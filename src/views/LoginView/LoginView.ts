// Базовая страница
import BaseView from '../BaseView';

import {Urls} from '../../constants/constants';

// Actions
import {userActions} from '../../actions/user';

// Stores
import UserStore from '../../stores/UserStore/UserStore';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './LoginView.hbs' or its corres... Remove this comment to see the full error message
import template from './LoginView.hbs';

/**
 * Класс, реализующий страницу с входа.
 */
export default class LoginView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent: any) {
        const context = new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        SettingsStore.addListener(this._onRefresh);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'formAuthorizationCallback' does not exis... Remove this comment to see the full error message
        this.formAuthorizationCallback = this.formAuthorization.bind(this);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements = {
            login: null,
            password: null,
        };
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this._setContext(new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));
        this.render();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Login... Remove this comment to see the full error message
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.removeEventListeners();
        this._setContext(new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Login... Remove this comment to see the full error message
        if (!this._isActive) {
            return;
        }

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     */
    render() {
        /* Если пользователь авторизован, то перебросить его на /boards */
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'LoginVi... Remove this comment to see the full error message
        if (this.context.get('isAuthorized')) {
            Router.go(Urls.Boards, true);
            return;
        }

        super.render();

        this.addEventListeners();

        this.registerInputElements();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        document.getElementById('auth').addEventListener('submit', this.formAuthorizationCallback);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('auth')?.removeEventListener('submit',
                                                             // @ts-expect-error ts-migrate(2339) FIXME: Property 'formAuthorizationCallback' does not exis... Remove this comment to see the full error message
                                                             this.formAuthorizationCallback);
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.login = document.getElementById('login');
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.password = document.getElementById('password');
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {object} event событие
     */
    formAuthorization(event: any) {
        event.preventDefault();

        const data = {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            login: this._inputElements.login.value,
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            password: this._inputElements.password.value,
        };

        userActions.login(data.login, data.password);
    }
}
