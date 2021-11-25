// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CardPopUp.hbs';

// Actions
import {cardActions} from '../../actions/card.js';
import {commentsActions} from '../../actions/comments.js';

// Stores
import BoardStore from '../../stores/BoardStore/BoardStore.js';

// Стили
import './CardPopUp.scss';

/**
 * Класс popup окна создания и редактирования карточки
 */
export default class CardPopUp extends BaseComponent {
    /**
     * @constructor
     */
    constructor() {
        super(null, template);
        this._bindCallBacks();
        this._elements = {};
        this.commentEdit = -1;
    }

    /**
     * Метод сохраняет ссылки на элементы popup'a
     * @private
     */
    _registerPopUpElements() {
        this._elements = {
            wrapper: document.getElementById('cardPopUpWrapperId'),
            closeBtn: document.getElementById('cardPopUpCloseId'),
            createBtn: document.getElementById('cardPopUpCreateBtnId'),
            saveBtn: document.getElementById('cardPopUpSaveBtnId'),
            positionSelect: document.getElementById('cardPopUpPositionId'),
            card_name: document.getElementById('cardPopUpTitleId'),
            description: document.getElementById('cardPopUpDescriptionId'),
            // deadline: document.getElementById('cardPopUpDeadlineId'),
            comments: {
                editBtns: document.querySelectorAll('.editComment'),
                saveBtns: document.querySelectorAll('.saveComment'),
                deleteBtns: document.querySelectorAll('.deleteComment'),
            },
            newCommentText: document.getElementById('newCommentTextId'),
            addCommentBtn: document.getElementById('createCommentId'),
        };
    }

    /**
     * Метод регистрирует callback
     * @private
     */
    addEventListeners() {
        this._registerPopUpElements();
        super.addEventListeners();
        this._elements.wrapper?.addEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.addEventListener('click', this._onPopUpClose);
        this._elements.createBtn?.addEventListener('click', this._onCreate);
        this._elements.saveBtn?.addEventListener('click', this._onSave);
        this._elements.comments?.editBtns?.forEach((editCommentBtn)=>{
            editCommentBtn.addEventListener('click', this._onEditComment);
        });
        this._elements.comments?.saveBtns?.forEach((saveCommentBtn)=>{
            saveCommentBtn.addEventListener('click', this._onUpdateComment);
        });
        this._elements.comments?.deleteBtns?.forEach((deleteCommentBtn)=>{
            deleteCommentBtn.addEventListener('click', this._onDeleteComment);
        });
        this._elements.addCommentBtn?.addEventListener('click', this._onCreateComment);
    };

    /**
     * Метод удаляет все ранее зарегестрированные callback
     * @private
     */
    removeEventListeners() {
        super.removeEventListeners();
        this._elements.wrapper?.removeEventListener('click', this._onPopUpClose);
        this._elements.closeBtn?.removeEventListener('click', this._onPopUpClose);
        this._elements.createBtn?.removeEventListener('click', this._onCreate);
        this._elements.saveBtn?.removeEventListener('click', this._onSave);
        this._elements.comments?.editBtns?.forEach((editCommentBtn)=>{
            editCommentBtn.removeEventListener('click', this._onEditComment);
        });
        this._elements.comments?.saveBtns?.forEach((saveCommentBtn)=>{
            saveCommentBtn.removeEventListener('click', this._onUpdateComment);
        });
        this._elements.comments?.deleteBtns?.forEach((deleteCommentBtn)=>{
            deleteCommentBtn.removeEventListener('click', this._onDeleteComment);
        });
        this._elements.addCommentBtn?.removeEventListener('click', this._onCreateComment);
    }

    /**
     * Метод биндит this контекст к callback методам
     * @private
     */
    _bindCallBacks() {
        this._onPopUpClose = this._onPopUpClose.bind(this);
        this._onCreate = this._onCreate.bind(this);
        this._onSave = this._onSave.bind(this);

        /* Comments */
        this._onDeleteComment = this._onDeleteComment.bind(this);
        this._onEditComment = this._onEditComment.bind(this);
        this._onUpdateComment = this._onUpdateComment.bind(this);
        this._onCreateComment = this._onCreateComment.bind(this);
    }

    /**
     * Callback, вызываемый при закрытии окна
     * @param {Event} event объект события
     * @private
     */
    _onPopUpClose(event) {
        if (event.target === this._elements.closeBtn ||
            event.target === this._elements.wrapper) {
            cardActions.hidePopUp();
        }
    }

    /**
     * Callback, вызываемый при нажатии "Сохранить"
     * @param {Event} event объект события
     * @private
     */
    _onSave(event) {
        event.preventDefault();
        cardActions.updateCard(
            parseInt(this._elements.positionSelect.value, 10),
            this._elements.card_name.value,
            this._elements.description.value,
            this.context.cid,
            this.context.bid,
            this.context.clid,
        );
    }

    /**
     * Callback, вызываемый при нажатии "Создать"
     * @param {Event} event объект события
     * @private
     */
    _onCreate(event) {
        event.preventDefault();
        cardActions.createCard(
            this._elements.card_name.value,
            this._elements.description.value,
        );
    }

    /**
     * Callback, вызываемый при нажатии "Создать комментарий"
     * @param {Event} event объект события
     * @private
     */
    _onCreateComment(event) {
        event.preventDefault();
        commentsActions.createComment(
            this._elements.newCommentText.value,
        );
    }

    /**
     * Callback, вызываемый при нажатии редактировании комментария
     * @param {Event} event объект события
     * @private
     */
    _onEditComment(event) {
        event.preventDefault();
        commentsActions.editComment(
            parseInt(event.target.dataset.id, 10),
        );
    }

    /**
     * Callback, вызываемый при нажатии "Обновить комментарий"
     * @param {Event} event объект события
     * @private
     */
    _onUpdateComment(event) {
        event.preventDefault();
        const newComment = event.target.closest('.comment')
            .querySelector('.commentInput').value;
        commentsActions.updateComment(
            newComment,
            parseInt(event.target.dataset.id, 10),
        );
    }

    /**
     * Callback, вызываемый при удалении комментария
     * @param {Event} event объект события
     * @private
     */
    _onDeleteComment(event) {
        event.preventDefault();
        commentsActions.deleteComment(
            parseInt(event.target.dataset.id, 10),
        );
    }
}
