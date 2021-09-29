'use strict';

import BasePage from './BasePage.js';

import {ConstantMessages, Html} from '../utils/constants.js';

/**
 * Класс, реализующий страницу-404
 */
export default class NotFoundPage extends BasePage {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor() {
        super();
        this.parent = document.getElementById(Html.Root);
    }

    /**
     *Метод, отрисовывающий страницу-404
     */
    render() {
        const message = document.createElement('h1');
        message.innerText = ConstantMessages.NotFound;
        message.style.color = '#8000FF';
        this.parent.innerHTML = '<br/> <a href="/"> На главную </a>';
        this.parent.appendChild(message);
    }
}
