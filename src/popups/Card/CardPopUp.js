// BaseComponent
import BaseComponent from '../../components/BaseComponent.js';

// Шаблон
import template from './CardPopUp.hbs';

// Actions
import {cardActions} from '../../actions/card.js';
import {commentsActions} from '../../actions/comments.js';
import {checkListAction} from '../../actions/checklist';

// Стили:
import './CardPopUp.scss';
import {attachmentsActions} from '../../actions/attachments';
import {tagsActions} from '../../actions/tags';

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
        this._elements = {checkList: {}, checkListItem: {}};
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
            comments: {
                editBtns: document.querySelectorAll('.editComment'),
                saveBtns: document.querySelectorAll('.saveComment'),
                deleteBtns: document.querySelectorAll('.deleteComment'),
            },
            newCommentText: document.getElementById('newCommentTextId'),
            addCommentBtn: document.getElementById('createCommentId'),
            deadline: document.getElementById('cardPopUpDeadlineId'),
            assigneeBtn: document.getElementById('cardPopUpAddAssigneeBtnId'),
            checkList: {
                createBtn: document.getElementById('cardPopUpAddCheckListBtnId'),
                editBtn: document.querySelectorAll('.checklist-edit'),
                saveBtn: document.querySelectorAll('.checklist-save'),
                deleteBtn: document.querySelectorAll('.checklist-delete'),
            },
            checkListItem: {
                createBtn: document.querySelectorAll('.checklist-add'),
                editBtn: document.querySelectorAll('.checklist-item-edit'),
                saveBtn: document.querySelectorAll('.checklist-item-save'),
                deleteBtn: document.querySelectorAll('.checklist-item-delete'),
                label: document.querySelectorAll('.checklist-item__label'),
            },
            attachInput: document.getElementById('attachmentInputId'),
            downloadAttachBtn: document.querySelectorAll('.attachment__download-btn'),
            deleteAttachBtn: document.querySelectorAll('.attachment__delete-btn'),
            scrollZone: document.getElementById('cardPopUpScrollZoneId'),
            tags: document.querySelectorAll('.card-popup-tag'),
            addTagBtn: document.getElementById('addTagCardPopUpId'),
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
        this._elements.deadline?.addEventListener('click', this._onDeadlineClick);
        this._elements.assigneeBtn?.addEventListener('click', this._onAssigneeClick);

        /* Check List */
        this._elements.checkList.createBtn?.addEventListener('click', this._onCreateCheckList);
        this._elements.checkList.deleteBtn?.forEach((element) => {
            element.addEventListener('click', this._onDeleteCheckList);
        });
        this._elements.checkList.editBtn?.forEach((element) => {
            element.addEventListener('click', this._onEditCheckList);
        });
        this._elements.checkList.saveBtn?.forEach((element) => {
            element.addEventListener('click', this._onSaveChekList);
        });

        /* Check List Item */
        this._elements.checkListItem.createBtn?.forEach((element) => {
            element.addEventListener('click', this._onCreateCheckListItem);
        });
        this._elements.checkListItem.editBtn?.forEach((element) => {
            element.addEventListener('click', this._onEditCheckListItem);
        });
        this._elements.checkListItem.saveBtn?.forEach((element) => {
            element.addEventListener('click', this._onSaveChekListItem);
        });
        this._elements.checkListItem.deleteBtn?.forEach((element) => {
            element.addEventListener('click', this._onDeleteCheckListItem);
        });
        this._elements.checkListItem.label?.forEach((element) => {
            element.addEventListener('click', this._onToggleChekListItem);
        });

        /* Tags */
        this._elements.tags?.forEach((tag) => {
            tag.addEventListener('click', this._onShowTagListPopUpCard);
        });
        this._elements.addTagBtn?.addEventListener('click', this._onShowTagListPopUpCard);

        if (!this.context.get('card-popup').edit) {
            this._elements.card_name?.focus();
        }

        if (this._elements.scrollZone) {
            this._elements.scrollZone.scrollTop = this.context.get('card-popup').scroll;
        }

        /* Attachments */
        this._elements.attachInput?.addEventListener('change', this._onUploadAttachment);
        this._elements.downloadAttachBtn?.forEach((element) => {
            element.addEventListener('click', this._onDownloadAttachment);
        });
        this._elements.deleteAttachBtn?.forEach((element) => {
            element.addEventListener('click', this._onDeleteAttachment);
        });
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
        this._elements.deadline?.removeEventListener('click', this._onDeadlineClick);
        this._elements.assigneeBtn?.removeEventListener('click', this._onAssigneeClick);

        /* Check List */
        this._elements.checkList.createBtn?.removeEventListener('click', this._onCreateCheckList);
        this._elements.checkList.deleteBtn?.forEach((element) => {
            element.removeEventListener('click', this._onDeleteCheckList);
        });
        this._elements.checkList.editBtn?.forEach((element) => {
            element.removeEventListener('click', this._onEditCheckList);
        });
        this._elements.checkList.saveBtn?.forEach((element) => {
            element.removeEventListener('click', this._onSaveChekList);
        });

        /* Check List Item */
        this._elements.checkListItem.createBtn?.forEach((element) => {
            element.removeEventListener('click', this._onCreateCheckListItem);
        });
        this._elements.checkListItem.editBtn?.forEach((element) => {
            element.removeEventListener('click', this._onEditCheckListItem);
        });
        this._elements.checkListItem.saveBtn?.forEach((element) => {
            element.removeEventListener('click', this._onSaveChekListItem);
        });
        this._elements.checkListItem.deleteBtn?.forEach((element) => {
            element.removeEventListener('click', this._onDeleteCheckListItem);
        });

        /* Attachments */
        this._elements.attachInput?.removeEventListener('change', this._onUploadAttachment);
        this._elements.downloadAttachBtn?.forEach((element) => {
            element.removeEventListener('click', this._onDownloadAttachment);
        });
        this._elements.deleteAttachBtn?.forEach((element) => {
            element.removeEventListener('click', this._onDeleteAttachment);
        });
        /* Tags */
        this._elements.tags?.forEach((tag) => {
            tag.removeEventListener('click', this._onShowTagListPopUpCard);
        });
        this._elements.addTagBtn?.removeEventListener('click', this._onShowTagListPopUpCard);
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
        this._onDeadlineClick = this._onDeadlineClick.bind(this);
        this._onAssigneeClick = this._onAssigneeClick.bind(this);

        /* CheckList */
        this._onCreateCheckList = this._onCreateCheckList.bind(this);
        this._onDeleteCheckList = this._onDeleteCheckList.bind(this);
        this._onEditCheckList = this._onEditCheckList.bind(this);
        this._onSaveChekList = this._onSaveChekList.bind(this);

        /* CheckList Item */
        this._onCreateCheckListItem = this._onCreateCheckListItem.bind(this);
        this._onDeleteCheckListItem = this._onDeleteCheckListItem.bind(this);
        this._onEditCheckListItem = this._onEditCheckListItem.bind(this);
        this._onSaveChekListItem = this._onSaveChekListItem.bind(this);
        this._onToggleChekListItem = this._onToggleChekListItem.bind(this);

        /* Attachments */
        this._onDownloadAttachment = this._onDownloadAttachment.bind(this);
        this._onUploadAttachment = this._onUploadAttachment.bind(this);
        this._onDeleteAttachment = this._onDeleteAttachment.bind(this);
        /* Tags */
        this._onShowTagListPopUpCard = this._onShowTagListPopUpCard.bind(this);
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
        const data = {
            pos: parseInt(this._elements.positionSelect.value, 10),
            card_name: this._elements.card_name.value,
            description: this._elements.description.value,
            cid: this.context.cid,
            bid: this.context.bid,
            clid: this.context.clid,
            deadline: this._elements.deadline.value,
        };
        cardActions.updateCard(data);
    }

    /**
     * Callback, вызываемый при нажатии "Создать"
     * @param {Event} event - объект события
     * @private
     */
    _onCreate(event) {
        event.preventDefault();
        cardActions.createCard(
            this._elements.card_name.value,
            this._elements.description.value,
            this._elements.deadline.value,
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
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
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
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
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
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
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
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }
    /**
     * Callback, вызываемый при редактировании дедлайна
     * @param {Event} event объект события
     * @private
     */
    _onDeadlineClick(event) {
        event.preventDefault();
        if (!this._elements.deadline.value) {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            this._elements.deadline.value = new Date(
                date.getTime() - (date.getTimezoneOffset() * 60000))
                .toISOString()
                .substring(0, 16);
        }
    }

    /**
     * Callback, вызываемый при нажатии "Участники"
     * @param {Event} event - объект события
     * @private
     */
    _onAssigneeClick(event) {
        event.preventDefault();
        cardActions.showAddCardAssigneePopUp();
    }
    /* CheckList */
    /**
     * CallBack на создание чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onCreateCheckList(event) {
        event.preventDefault();
        checkListAction.createCheckList();
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на удаление чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onDeleteCheckList(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        checkListAction.deleteCheckList(parseInt(chlid, 10));
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на редактирование чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onEditCheckList(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        checkListAction.editCheckList(parseInt(chlid, 10));
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на сохрание заголовка чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onSaveChekList(event) {
        event.preventDefault();
        const checkListContainer = event.target.closest('div.check-list');
        const chlid = checkListContainer.dataset.id;
        const title = checkListContainer.querySelector('.check-list__input').value;
        checkListAction.saveCheckList(parseInt(chlid, 10), title);
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }


    /* CheckList Item */
    /**
     * CallBack на осздание элемента чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onCreateCheckListItem(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        checkListAction.createCheckListItem(parseInt(chlid, 10));
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на удаление элемента чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onDeleteCheckListItem(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        const chliid = event.target.closest('div.checklist-item').dataset.id;
        checkListAction.deleteCheckListItem(parseInt(chlid, 10),
                                            parseInt(chliid, 10));
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на редактирование элемента чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onEditCheckListItem(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        const chliid = event.target.closest('div.checklist-item').dataset.id;
        checkListAction.editCheckListItem(parseInt(chlid, 10),
                                          parseInt(chliid, 10));
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на сохранение элемента чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onSaveChekListItem(event) {
        event.preventDefault();
        const checkListItemContainer = event.target.closest('div.checklist-item');
        const chlid = event.target.closest('div.check-list').dataset.id;
        const chliid = checkListItemContainer.dataset.id;
        const text = checkListItemContainer.querySelector('input.checklist-item__input').value;
        checkListAction.saveChekListItem(parseInt(chlid, 10),
                                         parseInt(chliid, 10),
                                         text);
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на переключение элемента чеклиста
     * @param {Event} event - объект события
     * @private
     */
    _onToggleChekListItem(event) {
        event.preventDefault();
        const chlid = event.target.closest('div.check-list').dataset.id;
        const chliid = event.target.closest('div.checklist-item').dataset.id;
        const status = event.target.checked;
        checkListAction.toggleChekListItem(parseInt(chlid, 10),
                                           parseInt(chliid, 10),
                                           status);
        cardActions.changeScroll(this._elements.scrollZone.scrollTop);
    }

    /**
     * CallBack на загрузку вложения
     * @param {Event} event - объект события
     * @private
     */
    _onUploadAttachment(event) {
        event.preventDefault();
        attachmentsActions.uploadAttachment(event.target.files[0]);
    }

    /**
     * CallBack на удаление вложения
     * @param {Event} event - объект события
     * @private
     */
    _onDeleteAttachment(event) {
        event.preventDefault();
        const atid = Number.parseInt(event.target.closest('div.attachment').dataset.id, 10);
        attachmentsActions.deleteAttachment(atid);
    }

    /**
     * CallBack на скачивание вложения
     * @param {Event} event - объект события
     * @private
     */
    _onDownloadAttachment(event) {
        event.preventDefault();
        const atid = Number.parseInt(event.target.closest('div.attachment').dataset.id, 10);
        attachmentsActions.downloadAttachment(atid);
    }
    /**
     * CallBack на добаление тега
     * @param {Event} event - объект события
     * @private
     */
    _onShowTagListPopUpCard(event) {
        event.preventDefault();
        tagsActions.showTagListPopUpCard();
    }
}
