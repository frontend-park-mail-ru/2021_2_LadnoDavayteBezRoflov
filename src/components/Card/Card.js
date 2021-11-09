// Базовый компонент
import BaseComponent from '../BaseComponent.js';

// Шаблон
import template from './Card.hbs';

// Стили
import './Card.scss';

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
<<<<<<< HEAD

        this._popupTemplate = templatePopup;

        document.getElementById('removeCardList')?.addEventListener('click', this._addCardList);

        this._onRefresh = this._onRefresh.bind(this);
        BoardStore.addListener(this._onRefresh);

        this._backCallback = this._back.bind(this);
        this._updateCallback = this._update.bind(this);

        this._popupTemplate = templatePopup;

        this._inputElements = {
            title: null,
            description: null,
            deadline: null,
        };
    }

    /**
     * Метод, вызывающийся при обновлении карточки.
     * @return {html} код компонента
     */
    _onRefresh() {
        return this._popupTemplate(this.context);
    }

    /**
     * Метод, рендерящий попап.
     * @param {Object} pathParams параметры адресной строки
     * @param {bool} mode - режим - изменение true, добавление false
     * @return {html} код элемента
     */
    __renderPopup(pathParams, mode) {
        this.context = BoardStore.getCardByCID(pathParams.id);
        this._cid = pathParams.id;
        this.context.mode = mode;
        return this._popupTemplate(this.context);
    }

    /**
     * Метод, вызывающийся при переходе на карточку через роутер.
     * @param {Object} urlData параметры адресной строки
     */
    _onShow(urlData) {
        Router.go(`/board/${BoardStore.getCardByCID(urlData.pathParams.id).bid}`);
        // Для отображения страницы нужно время - иначе рискуем не успеть перенаправиться правильно, ждем
        window.setTimeout(() => Router.go(`/card/${urlData.pathParams.id}`, true), 1000);
    }

    /**
     * Метод, вызывающийся при переходе на карточку через роутер с режимом попапа.
     * @param {any} urlData параметры адресной строки
     */
    _onPopup(urlData) {
        document.getElementById('popup').innerHTML = this.__renderPopup(urlData.pathParams, true);
        document.getElementById('back')?.addEventListener('click', this._back);
        document.getElementById('update')?.addEventListener('click', this._update);

        this._inputElements.title = document.getElementById('title');
        this._inputElements.description = document.getElementById('description');
        this._inputElements.deadline = document.getElementById('deadline');
    }

    /**
     * Метод, вызывающийся при сокрытии карточки.
     */
    _onHide() {
        document.getElementById('popup').innerHTML = null;
    }

    /**
     * Метод, добавляющий event listeners.
     */
    addEventListeners() {
        document.getElementById('deleteCard')?.addEventListener('click', this._deleteCard);
    }

    /**
     * Метод, вызывающийся при выходе из попапа карточки.
     * @param {any} event
     */
    _back(event) {
        event.preventDefault();
        document.getElementById('back')?.removeEventListener('click', this._back);
        document.getElementById('update')?.addEventListener('click', this._update);
        Router.prev();
    }

    /**
     * Метод, вызывающийся при обновлении карточки.
     * @param {any} event
     */
    _update(event) {
        event.preventDefault();
        cardActions.updateCard(this._cid, null, null, this._inputElements.title.value,
                               this._inputElements.description.value,
                               this._inputElements.deadline.value, null, null, null, null);
        document.getElementById('back')?.addEventListener('click', this._back);
        document.getElementById('update')?.removeEventListener('click', this._back);
        Router.prev();
    }

    /**
     * Метод, вызывающийся при создании карточки.
     * @param {any} event
     */
    _addCard(event) {
        event.preventDefault();
        cardActions.addCard(this._cid, null, null, this._inputElements.title.value,
                            this._inputElements.description.value,
                            this._inputElements.deadline.value, null, null, null, null); // todo
    }

    /**
     * Метод, вызывающийся при удалении карточки.
     * @param {any} event
     */
    _deleteCard(event) {
        event.preventDefault();
        cardActions.deleteCard(this._cid);
    }

    /**
     * Метод, удаляющий обработчики событий для компонента.
     */
    removeEventListeners() {
        document.getElementById('deleteCard')?.removeEventListener('click', this._deleteCard);
=======
>>>>>>> LDBR-2.27: Переделать попапы карточек. Ребейзнуть исправления системы попапов. Исправить отображение карточек.
    }
}
