// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './CreateBoardPopUp.hbs' or its... Remove this comment to see the full error message
import template from './CreateBoardPopUp.hbs';

// Actions
import {boardsActions} from '../../actions/boards';

/**
 * Класс popup окна настроек доски
 */
export default class CreateBoardPopUp extends BaseComponent {
    /**
     * Конструирует объект BoardSettingPopUp
     */
    constructor() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(null, template);
        this._bindCallBacks();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements = {};
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.submitBtn?.addEventListener('click', this._onSaveBtnClick);
        document.addEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.name?.focus();
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
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
    _onPopUpClose(event: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            boardsActions.hidePopUp();
        }
    }

    /**
     * Обработчик события отправки формы создания доски
     * @param {Object} event
     * @private
     */
    _onSaveBtnClick(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        boardsActions.createBoard(this._elements.name.value,
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
                                  parseInt(this._elements.team.value, 10));
    }
}
