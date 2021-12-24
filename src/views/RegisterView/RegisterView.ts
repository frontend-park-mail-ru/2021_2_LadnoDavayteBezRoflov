// Базовая страница
import BaseView from '../BaseView';

// Actions
import {userActions} from '../../actions/user';

// Stores
import UserStore from '../../stores/UserStore/UserStore';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router';

import {Urls} from '../../constants/constants';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './RegisterView.hbs' or its cor... Remove this comment to see the full error message
import template from './RegisterView.hbs';

/**
  * Класс, реализующий страницу регистрации.
  */
export default class RegisterView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
     */
    constructor(parent: any) {
        const context = new Map([
            ...UserStore.getContext(),
            ...SettingsStore.getContext(),
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);

        UserStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'formRegistrationCallback' does not exist... Remove this comment to see the full error message
        this.formRegistrationCallback = this.formRegistration.bind(this);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements = {
            login: null,
            email: null,
            password: null,
            passwordRepeat: null,
        };
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this.render();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Regis... Remove this comment to see the full error message
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...SettingsStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
        ]));

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Regis... Remove this comment to see the full error message
        if (!this._isActive) {
            return;
        }

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     */
    render() {
        /* Если пользователь авторизован, то перебросить его на страницу списка досок */
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Registe... Remove this comment to see the full error message
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
        document.getElementById('register').addEventListener('submit', this.formRegistrationCallback);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('register')?.removeEventListener('submit',
                                                                 // @ts-expect-error ts-migrate(2339) FIXME: Property 'formRegistrationCallback' does not exist... Remove this comment to see the full error message
                                                                 this.formRegistrationCallback);
    }

    /**
     * Метод, регистрирующий поля ввода в документе.
     */
    registerInputElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.login = document.getElementById('login');
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.email = document.getElementById('email');
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.password = document.getElementById('password');
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
        this._inputElements.passwordRepeat = document.getElementById('passwordRepeat');
    }

    /**
     * Метод, обрабатывающий посылку формы.
     * @param {object} event событие
     */
    formRegistration(event: any) {
        event.preventDefault();

        const data = {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            login: this._inputElements.login.value,
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            email: this._inputElements.email.value,
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            password: this._inputElements.password.value,
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_inputElements' does not exist on type '... Remove this comment to see the full error message
            passwordRepeat: this._inputElements.passwordRepeat.value,
        };

        userActions.register(data.login, data.email, data.password, data.passwordRepeat);
    }
}
