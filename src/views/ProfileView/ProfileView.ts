import BaseView from '../BaseView';

// Actions
import {settingsActions} from '../../actions/settings';

// Stores
import UserStore from '../../stores/UserStore/UserStore';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Modules
import Router from '../../modules/Router/Router';

// Constants
import {Urls} from '../../constants/constants';

// Стили
import './ProfileView.scss';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './ProfileView.hbs' or its corr... Remove this comment to see the full error message
import template from './ProfileView.hbs';

/**
  * Класс, реализующий страницу профиля.
  */
export default class ProfileView extends BaseView {
    /**
    * @constructor
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent: any) {
        const context = new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...SettingsStore.getContext(),
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh); // + field
        SettingsStore.addListener(this._onRefresh);

        this.formUpdate = this.formUpdate.bind(this);
        this.onAvatarChange = this.onAvatarChange.bind(this);

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
        if (!UserStore.getContext('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }

        settingsActions.getSettings(UserStore.getContext('userName'));
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Profi... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...SettingsStore.getContext()],
        ));

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Profi... Remove this comment to see the full error message
        if (!this._isActive) {
            return;
        }

        this.render();
    }

    /**
     * Метод, отрисовывающий страницу.
     * @param {object} context контекст отрисовки страницы
     */
    render() {
        /* Если пользователь не авторизован, то перебросить его на страницу входа */
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Profile... Remove this comment to see the full error message
        if (!this.context.get('isAuthorized')) {
            Router.go(Urls.Login, true);
            return;
        }

        super.render();

        this.addEventListeners();
    }

    /**
     * Метод, добавляющий обработчики событий для страницы.
     */
    addEventListeners() {
        super.addEventListeners();
        document.getElementById('profile')?.addEventListener('submit', this.formUpdate);
        document.getElementById('avatar')?.addEventListener('change', this.onAvatarChange);
    }

    /**
     * Метод, удаляющий обработчики событий для страницы.
     */
    removeEventListeners() {
        super.removeEventListeners();
        document.getElementById('profile')?.removeEventListener('submit', this.formUpdate);
        document.getElementById('avatar')?.removeEventListener('change', this.onAvatarChange);
    }

    /**
     * Обработчик: отправка формы.
     * @param {object} event событие
     */
    formUpdate(event: any) {
        event.preventDefault();
        const data = {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            login: document.getElementById('login').value,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            email: document.getElementById('email').value,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            avatar: document.getElementById('avatar').value,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            password: document.getElementById('password').value,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            passwordRepeat: document.getElementById('passwordRepeat').value,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            old_password: document.getElementById('oldPassword').value,
        };

        settingsActions.putSettings(data);
    }

    /**
     * Обработчик: загрузка аватарки пользователя.
     * @param {object} event
     */
    onAvatarChange(event: any) {
        settingsActions.uploadAvatar(event.target.files[0]);
    }
}
