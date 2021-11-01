// Базовый компонент
import BaseComponent from '../BaseComponent.js';

// Modules
import Router from '../../modules/Router/Router.js';

// Stores
import BoardStore from '../../stores/BoardStore/BoardStore.js';

// Шаблон
import template from './Card.hbs';

// Шаблон
import templatePopup from './CardPopup.hbs';

/**
 * Класс, реализующий компонент Card.
 */
export default class CardComponent extends BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context) {
        super(context, template);

        this._onRefresh = this._onRefresh.bind(this);
        BoardStore.addListener(this._onRefresh);

        this._backCallback = this._back.bind(this);

        this._popupTemplate = templatePopup;
    }

    /**
     * Метод, вызывающийся при обновлении карточки.
     * @return {html} код компонента
     */
    _onRefresh() {
        this.context = BoardStore.getCardByCID(this._cid);
        return this._popupTemplate(this.context);
    }

    /**
     * Метод, рендерящий попап.
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
     * Метод, вызывающийся при переходе на карточку через роутер с режимом попапа.
     * @param {any} urlData
     */
    _onPopup(urlData) {
        document.getElementById('popup').innerHTML = this.__renderPopup(urlData.pathParams);
        document.getElementById('back')?.addEventListener('click', this._back);
    }

    /**
     * Метод, вызывающийся при сокрытии карточки.
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
     * Метод, вызывающийся при выходе из попапа карточки.
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
