import BaseView from '../BaseView.js';

import UserStore from '../../stores/UserStore/UserStore.js';

import '/src/tmpl.js';

/**
 * Класс, реализующий страницу "не найдено".
 */
export default class NotFoundView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent элемент, в который будет происходить отрисовка
     */
    constructor(parent) {
        const context = UserStore.getContext();
        super(context, Handlebars.templates['views/NotFoundView/NotFoundView'], parent);

        this._onRefresh = this._onRefresh.bind(this);
        UserStore.addListener(this._onRefresh);
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
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        this.context = UserStore.getContext();

        this._setContext(this.context);
    }
}
