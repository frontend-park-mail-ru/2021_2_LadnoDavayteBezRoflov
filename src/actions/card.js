'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardActionTypes = {
    CARD_CREATE_SHOW_POPUP: 'card/create/show',
    CARD_EDIT_SHOW_POPUP: 'card/edit/show',
    CARD_HIDE_POPUP: 'card/hide',
    CARD_UPDATE_SUBMIT: 'card/update/submit',
    CARD_CREATE_SUBMIT: 'card/create/submit',
    CARD_DELETE_SHOW: 'card/delete/show',
    CARD_DELETE_CHOOSE: 'card/delete/choose',
    CARD_DELETE_HIDE: 'card/delete/hide',
    CARD_UPDATE_STATUS: 'card/update/deadline',
    CARD_ADD_ASSIGNEE_SHOW: 'card/assignee/show',
    CARD_ADD_ASSIGNEE_CLOSE: 'card/assignee/close',
    CARD_ADD_ASSIGNEE_INPUT: 'card/assignee/input',
    CARD_ADD_ASSIGNEE_USER_CLICKED: 'card/assignee/clicked',
    SCROLL_CHANGED: 'card/scroll',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardActions = {
    /**
     * Отобразить popup создания карточки
     * @param {Number} clid id списка карточек
     */
    showCreateCardPopUp(clid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_CREATE_SHOW_POPUP,
            data: {clid},
        });
    },

    /**
     * Отобразить popup редактирования карточки
     * @param {Number} clid id списка карточек
     * @param {Number} cid id карточки
     */
    showEditCardPopUp(clid, cid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_EDIT_SHOW_POPUP,
            data: {
                clid,
                cid,
            },
        });
    },

    /**
     * Скрыть popup создания/редактирования карточки
     */
    hidePopUp() {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_HIDE_POPUP,
        });
    },

    /**
     * Обновляет список карточек
     * @param {Object} data объект, содержащий поля карточки
     */
    updateCard(data) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_UPDATE_SUBMIT,
            data,
        });
    },

    /**
     * Обновляет статус дедлайна карточки
     * @param {Number} clid id списка карточек
     * @param {Number} cid id карточки
     */
    updateDeadlineCard(clid, cid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_UPDATE_STATUS,
            data: {
                clid,
                cid,
            },
        });
    },


    /**
     * Создает карточку
     * @param {String} title заголовок
     * @param {String} description описание
     * @param {String} deadline дедлайн
     */
    createCard(title, description, deadline) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_CREATE_SUBMIT,
            data: {
                card_name: title,
                description,
                deadline,
            },
        });
    },

    /**
     * Отобразить popup удаления карточки
     * @param {Number} clid id списка карточек
     * @param {Number} cid id карточки
     */
    showDeleteCardPopUp(clid, cid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE_SHOW,
            data: {
                clid,
                cid,
            },
        });
    },

    /**
     * Скрыть pop удаления карточки с выбором "удалять" или "не удалять"
     * @param {Boolean} confirmation подтверждено ли удаление
     */
    deleteCard(confirmation) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE_CHOOSE,
            data: {confirmation},
        });
    },

    /**
     * Скрыть pop удаления карточки
     */
    hideDeleteCardPopUp() {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE_HIDE,
        });
    },

    /**
     * Отобразить popup добавления пользователя на карточку
     */
    showAddCardAssigneePopUp() {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_ADD_ASSIGNEE_SHOW,
        });
    },

    /**
     * Скрыть popup добавления пользователя на карточку
     */
    hideAddCardAssigneePopUp() {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_ADD_ASSIGNEE_CLOSE,
        });
    },

    /**
     * Обновить список пользователей на основании ввода пользователя
     * @param {String} searchString - строка для поиска
     */
    refreshUserSearchList(searchString) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_ADD_ASSIGNEE_INPUT,
            data: {searchString},
        });
    },

    /**
     * Добаваить/исключить пользователя из карточки
     * @param {Number} uid - id пользователя
     */
    toggleUserInSearchList(uid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_ADD_ASSIGNEE_USER_CLICKED,
            data: {uid},
        });
    },

    /**
     * Передает в стор значение скрола
     * @param {Number} scrollValue - значение top скрола в px
     */
    changeScroll(scrollValue) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.SCROLL_CHANGED,
            data: {scrollValue},
        });
    },
};
