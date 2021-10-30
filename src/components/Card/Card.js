// Базовый компонент
import BaseComponent from '../BaseComponent.js';

// Modules
import Router from '../../modules/Router/Router.js';

// Stores
import BoardStore from '../../stores/BoardStore/BoardStore.js';


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

        this._onRefresh = this._onRefresh.bind(this);
        BoardStore.addListener(this._onRefresh);

        this._backCallback = this._back.bind(this);

        this._popupTemplate = Handlebars.templates['components/Card/CardPopup'];
    }

    /**
     * Description
     * @return {any}
     */
    _onRefresh() {
        this.context = BoardStore.getCardByCID(this._cid);
        return this._popupTemplate(this.context);
    }

    /**
     * Description
     * @param {any} pathParams
     * @return {any}
     */
    __renderPopup(pathParams) {
        // action?
        this.context = BoardStore.getCardByCID(pathParams.id);
        this._cid = pathParams.id;
        return this._popupTemplate(this.context);
    }

    /**
     * Метод, вызывающийся при переходе на карточку через роутер.
     * @param {any} urlData
     */
    _onShow(urlData) {
        Router.go(`/board/${BoardStore.getCardByCID(urlData.pathParams.id).bid}`);
        // Для отображения страницы нужно время - иначе рискуем не успеть перенаправиться правильно, ждем
        window.setTimeout(() => Router.go(`/card/${urlData.pathParams.id}`, true), 1000);
    }

    /**
     * Description
     * @param {any} urlData
     */
    _onPopup(urlData) {
        document.getElementById('popup').innerHTML = this.__renderPopup(urlData.pathParams);
        document.getElementById('back')?.addEventListener('click', this._back);
    }

    /**
     * Description
     */
    _onHide() {
        document.getElementById('popup').innerHTML = null;
    }

    /**
     * Description
     */
    addEventListeners() {
    }

    /**
     * Description
     * @param {any} event
     */
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
