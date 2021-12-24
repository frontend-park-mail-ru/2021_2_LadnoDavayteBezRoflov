import BaseView from '../BaseView';

import UserStore from '../../stores/UserStore/UserStore';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './OfflineView.hbs' or its corr... Remove this comment to see the full error message
import template from './OfflineView.hbs';

/**
 * Класс, реализующий страницу "не найдено".
 */
export default class OfflineView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent элемент, в который будет происходить отрисовка
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
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));

        this.render();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'Offli... Remove this comment to see the full error message
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            ...UserStore.getContext(),
            ['avatar', SettingsStore.getContext('avatar')],
            ['navbar', SettingsStore.getContext('navbar')],
            ['offline', SettingsStore.getContext('offline')],
        ]));
    }
}
