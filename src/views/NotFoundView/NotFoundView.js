import BaseView from '../BaseView.js';

import UserStore from '../../stores/UserStore/UserStore.js';
import SettingsStore from '../../stores/SettingsStore/SettingsStore';

// Шаблон
import template from './NotFoundView.hbs';

/**
 * Класс, реализующий страницу "не найдено".
 */
export default class NotFoundView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent элемент, в который будет происходить отрисовка
     */
    constructor(parent) {
        const context = new Map([...UserStore.getContext(), ...SettingsStore.getContext()]);
        super(context, template, parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);
        SettingsStore.addListener(this._onRefresh);
    }

    /**
     * Метод, отрисовывающий страницу-404
     * @return {html} отрендеренный код
     */
    render() {
        // здесь нужно с return
        return super.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        this.render();
        this._isActive = true;
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this._setContext(new Map([...UserStore.getContext(), ...SettingsStore.getContext()]));
    }
}
