'use strict';

import BasePage from './BasePage.js';

import {constantMessages} from '../utils/constants.js';

export default class NotFoundPage extends BasePage {
    /**
    * Конструктор, создающий конструктор базовой страницы с нужными параметрами
    * @param {Element} parent HTML-элемент, в который будет осуществлена отрисовка
    */
    constructor(parent) {
        super();
        this.parent = parent;
    }

    render() {
        const message = document.createElement('h1');
        message.innerText = constantMessages.notFound;
        message.style.color = '#8000FF';
        this.parent.innerHTML = '<br/> <a href="/"> На главную </a>';
        this.parent.appendChild(message);
    }
}
