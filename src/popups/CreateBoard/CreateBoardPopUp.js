// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Стор
import BoardsStore from '../../stores/BoardsStore/BoardsStore.js';

// Шаблон
import template from './CreateBoardPopUp.hbs';

// Actions
import {boardsActions} from '../../actions/boards.js';

// Любой попап сначала закрывается. Только после этого может что происходить не связанное с ним.

/**
 * Класс popup окна настроек доски
 */
export default class CreateBoardPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
     * @param {Element} parent - элемент, в который отрисуется данный popup
     */
    constructor(parent) {
        super(null, template, parent);
        this._onStoreRefresh = this._onStoreRefresh.bind(this);
        BoardsStore.addListener(this._onStoreRefresh);
        this._bindCallBacks();
        this._registerPopUpElements();
    }


    /**
     * Метод, вызываемый при обновлении стора.
     * @private
     */
    _onStoreRefresh() {
        this._setContext(BoardsStore.getCreateBoardPopUpContext());
        console.log('context in create board popup');
        console.log(this.context);
        this._removeEventListeners();
        super.render();
        this._registerPopUpElements();
        this._addEventListeners();
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
    _addEventListeners() {
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.submitBtn?.addEventListener('click', this._onSaveBtnClick);
        document.addEventListener('click', this._onPopUpClose);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    _removeEventListeners() {
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
        boardsActions.createBoard(this._elements.name.value, this.context.teamID);
    }
}
