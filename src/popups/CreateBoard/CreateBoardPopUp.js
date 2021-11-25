// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CreateBoardPopUp.hbs';

// Actions
import {boardsActions} from '../../actions/boards.js';

/**
 * Класс popup окна настроек доски
 */
export default class CreateBoardPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
     */
    constructor() {
        super(null, template);
        this._bindCallBacks();
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        this._elements = {
            closeBtn: document.getElementById('createBoardPopUpCloseId'),
            wrapper: document.getElementById('createBoardPopUpWrapperId'),
            name: document.getElementById('createBoardPopUpNameId'),
            team: document.getElementById('createBoardPopUpTeamId'),
            submitBtn: document.getElementById('createBoardPopUpSubmitId'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.submitBtn?.addEventListener('click', this._onSaveBtnClick);
        document.addEventListener('click', this._onPopUpClose);
        this._elements.name?.focus();
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        this._elements.submitBtn?.removeEventListener('click', this._onSaveBtnClick);
        document.removeEventListener('click', this._onPopUpClose);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onSaveBtnClick = this._onSaveBtnClick.bind(this);
    }

    /**
     * Скрывает модальное окно создания доски
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            boardsActions.hidePopUp();
        }
    }

    /**
     * Обработчик события отправки формы создания доски
     * @param {Object} event
     * @private
     */
    _onSaveBtnClick(event) {
        event.preventDefault();
        boardsActions.createBoard(this._elements.name.value,
                                  parseInt(this._elements.team.value, 10));
    }
}
