import BaseView from './BaseView.js';

import {ConstantMessages} from '../constants/constants.js';

/**
 * Класс, реализующий технический "view" для страницы "не найдено"
 */
export default class NotFoundView extends BaseView {
    /**
     * @constructor
     * @param {Element} parent элемент, в который будет происходить отрисовка
     */
    constructor(parent) {
        super(null, null, parent);
    }

    /**
     *Метод, отрисовывающий страницу-404
     */
    render() {
        const message = document.createElement('h1');
        message.innerText = ConstantMessages.NotFound;
        message.style.color = '#8000FF';
        this.parent.innerHTML = '<br/> <a href="/"> На главную </a>';
        this.parent.appendChild(message);
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
        this.render();
    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {

    }
}
