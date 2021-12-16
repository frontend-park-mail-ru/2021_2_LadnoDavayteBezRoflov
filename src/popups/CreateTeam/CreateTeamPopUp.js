// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CreateTeamPopUp.hbs';

// Actions
import {teamsActions} from '../../actions/teams.js';

/**
 * Класс popup окна создания команды
 */
export default class CreateTeamPopUp extends BaseComponent {
    /**
     * Конструирует объект CreateTeamPopUp
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
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.createBtn?.addEventListener('click', this._onCreateBtnClick);
        this._elements.saveBtn?.addEventListener('click', this._onSaveBtnClick);
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
        this._elements.createBtn?.removeEventListener('click', this._onCreateBtnClick);
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
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            teamsActions.hideTeamPopUp();
        }
    }

    /**
     * Обработчик события отправки формы сохранения названия команды
     * @param {Object} event объект события
     * @private
     */
    _onSaveBtnClick(event) {
        event.preventDefault();
        teamsActions.submitEditTeamPopUp(this._elements.name.value);
    }

    /**
     * Обработчик события отправки формы создания команды
     * @param {Object} event объект события
     * @private
     */
    _onCreateBtnClick(event) {
        event.preventDefault();
        teamsActions.submitAddTeamPopUp(this._elements.name.value);
    }
}
