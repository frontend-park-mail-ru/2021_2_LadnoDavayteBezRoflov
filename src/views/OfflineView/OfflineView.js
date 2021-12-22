import BaseView from '../BaseView.js';

import UserStore from '../../stores/UserStore/UserStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore.js';

// Шаблон
import template from './OfflineView.hbs';

/**
 * Класс, реализующий страницу "не найдено".
 */
export default class OfflineView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent элемент, в который будет происходить отрисовка
     */
    constructor(parent) {
        const context = new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);
    }

    /**
     * Метод, отрисовывающий offline
     */
    render() {
        super.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this._setContext(new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));

        this.render();
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));
    }
}
