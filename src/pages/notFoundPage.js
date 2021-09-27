import BasePage from './basePage.js';
import {constants} from '../utils/constants.js';

export default class NotFoundPage extends BasePage {

    /**
     * Конструктор, создающий класс реализации страницы-404.
     */
    constructor() {
        super();
        this.root = document.getElementById(constants.elementsID.appRoot);
    }

    render() {
        let message = document.createElement('h1');
        message.innerText = constants.texts.notFound;
        message.style.color = '#8000FF';
        this.root.innerHTML = '';
        this.root.appendChild(message);
    }
}
