// Базовый компонент
import cardActions from '../../actions/card.js';
import Router from '../../modules/Router/Router.js';
import BoardStore from '../../stores/BoardStore/BoardStore.js';
import BaseComponent from '../BaseComponent.js';

import { Urls } from '../../constants/constants.js';

/**
 * Класс, реализующий компонент Card.
 */
export default class CardComponent extends BaseComponent {
    /**
    * @constructor
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context) {
        super(context, Handlebars.templates['components/Card/Card']);

        //this._onRefresh = this._onRefresh.bind(this);
        //BoardStore.addListener(this._onRefresh);

        this._backCallback = this._back.bind(this);

        this._popupTemplate = Handlebars.templates['components/Card/CardPopup'];
    }

    _onRefresh() {
        //this.context = BoardStore.getContext('_currentCard');
        //console.log('bstore', BoardStore.getContext('_currentCard'))
        return this._popupTemplate(this.context);
    }

    __renderPopup(pathParams) {
        alert(pathParams.id)
        this.context = BoardStore.getCardContext(pathParams.id)
        alert(this.context);
        return this._popupTemplate(this.context);
    }
    
    _onShow(urlData) {
        // редирект на доску и открытие попапа. не работает
        Router.go(`/board/${BoardStore.getBoardByCID(urlData.pathParams.id)}`);
        Router.go(`/card/${urlData.pathParams.id}`, true);
    }

    _onPopup(urlData) {
        document.getElementById('popup').innerHTML = this.__renderPopup(urlData.pathParams);
        document.getElementById('back')?.addEventListener('click', this._back);       
    }

    _onHide() {
        document.getElementById('popup').innerHTML = null;
    }

    addEventListeners() {
    }

    _back(event) {
        event.preventDefault();

        document.getElementById('back')?.removeEventListener('click', this._back);

        Router.prev();
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
    }
}
