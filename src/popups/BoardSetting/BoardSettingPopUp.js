// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Стор
import BoardStore from '../../stores/BoardStore/BoardStore.js';

// Шаблон
import template from './BoardSettingPopUp.hbs';

// Actions
import {boardActions} from '../../actions/board.js';

// Любой попап сначала закрывается. Только после этого может что происходить не связанное с ним.

/**
 * Класс popup окна настроек доски
 */
export default class BoardSettingPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
     * @param {Element} parent - элемент, в который отрисуется данный popup
     */
    constructor(parent) {
        super(null, template, parent);
        this._onStoreRefresh = this._onStoreRefresh.bind(this);
        BoardStore.addListener(this._onStoreRefresh);
        this._bindCallBacks();
        this._registerPopUpElements();
    }


    /**
     * Метод, вызываемый при обновлении стора.
     * @private
     */
    _onStoreRefresh() {
        this._setContext(BoardStore.getSettingPopUpContext());
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
            wrapper: document.getElementById('boardSettingPopUpWrapperId'),
            saveBtn: document.getElementById('boardSettingPopUpSaveBtnId'),
        };
    }

    /**
     * Метод регестрирует callback
     * @private
     */
    _addEventListeners() {
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    _removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
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
     * Callback, вызываемый при закрытии окна настроек
     * @private
     */
    _onPopUpClose() {
        boardActions.hideBoardSettingsPopUp();
    }

    /**
     * Callback, вызываемый при нажатии кнопки "Сохранить"
     * @private
     */
    _onSaveBtnClick() {
        boardActions.updateBoardTitleDescription(' board title', 'board description');
    }
}
