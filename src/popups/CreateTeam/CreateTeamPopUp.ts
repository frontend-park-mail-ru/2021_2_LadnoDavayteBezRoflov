// BaseComponent
import BaseComponent from '../../components/BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './CreateTeamPopUp.hbs' or its ... Remove this comment to see the full error message
import template from './CreateTeamPopUp.hbs';

// Actions
import {teamsActions} from '../../actions/teams';

/**
 * Класс popup окна создания команды
 */
export default class CreateTeamPopUp extends BaseComponent {
    /**
     * Конструирует объект CreateTeamPopUp
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
            closeBtn: document.getElementById('createTeamPopUpCloseId'),
            wrapper: document.getElementById('createTeamPopUpWrapperId'),
            name: document.getElementById('createTeamPopUpNameId'),
            createBtn: document.getElementById('createTeamPopUpSubmitId'),
            saveBtn: document.getElementById('editTeamPopUpSubmitId'),

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
        this._elements.createBtn?.addEventListener('click', this._onCreateBtnClick);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.saveBtn?.addEventListener('click', this._onSaveBtnClick);
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
        this._elements.createBtn?.removeEventListener('click', this._onCreateBtnClick);
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        this._elements.saveBtn?.removeEventListener('click', this._onSaveBtnClick);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onSaveBtnClick = this._onSaveBtnClick.bind(this);
        this._onCreateBtnClick = this._onCreateBtnClick.bind(this);
    }

    /**
     * Скрывает модальное окно создания команды
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event: any) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        if (event.target === this._elements.closeBtn ||
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
            event.target === this._elements.wrapper) {
            teamsActions.hideTeamPopUp();
        }
    }

    /**
     * Обработчик события отправки формы сохранения названия команды
     * @param {Object} event объект события
     * @private
     */
    _onSaveBtnClick(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        teamsActions.submitEditTeamPopUp(this._elements.name.value);
    }

    /**
     * Обработчик события отправки формы создания команды
     * @param {Object} event объект события
     * @private
     */
    _onCreateBtnClick(event: any) {
        event.preventDefault();
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_elements' does not exist on type 'Creat... Remove this comment to see the full error message
        teamsActions.submitAddTeamPopUp(this._elements.name.value);
    }
}
