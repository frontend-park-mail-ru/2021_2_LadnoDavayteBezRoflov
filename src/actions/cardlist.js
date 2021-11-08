'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardListActionTypes = {
    // Отобразить popup создание CL
    CARD_LIST_CREATE_SHOW: 'cardlist/create/show',
    // Отобразить popup редактирования CL
    CARD_LIST_EDIT_SHOW: 'cardlist/edit/show',
    // Скрыть popup CL
    CARD_LIST_HIDE: 'cardlist/hide',
    // Обновить CL
    CARD_LIST_UPDATE_SUBMIT: 'cardlist/update/submit',
    // Создать CL
    CARD_LIST_CREATE_SUBMIT: 'cardlist/create/submit',
    // Отобразить popup удаления списка карточек
    CARD_LIST_DELETE_SHOW: 'cardlist/delete/show',
    // Скрыть pop удаления списка карточек с выбором "удалять" или "не удалять"
    CARD_LIST_DELETE_CHOOSE: 'cardlist/delete/choose',
    // Скрыть pop удаления списка карточек
    CARD_LIST_DELETE_HIDE: 'cardlist/delete/hide',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardListActions = {
    /**
     * Отобразить popup создания cardlist
     */
    showCreateCardListPopUp() {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_CREATE_SHOW,
        });
    },

    /**
     * Отобразить popup редактирования cardlist
     * @param {Number} cid id списка карточек
     */
    showEditCardListPopUp(cid) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_EDIT_SHOW,
        });
    },

    /**
     * Скрыть popup создания/редактирования доски.
     */
    hideCardListPopUp() {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_HIDE,
        });
    },

    /**
     * Обновляет список карточек
     * @param {Number} position позиция на доске
     * @param {String} title заголовок
     */
    updateCardList(position, title) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_UPDATE_SUBMIT,
            data: {
                cardList_name: title,
                position,
            },
        });
    },

    /**
     * Создает список карточек
     * @param {String} title заголовок списка
     */
    createCardList(title) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_CREATE_SUBMIT,
            data: {
                cardList_name: title,
            },
        });
    },

    /**
     * Отобразить popup удаления списка карточек
     * @param {Number} cid id списка карточек
     */
    showDeleteCardListPopUp(cid) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_CREATE_SUBMIT,
            data: {
                cid,
            },
        });
    },

    /**
     * Скрыть pop удаления списка карточек с выбором "удалять" или "не удалять"
     * @param {Boolean} confirm подтверждено ли удаление
     */
    deleteCardList(confirm) {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_DELETE_CHOOSE,
            data: {
                confirm,
            },
        });
    },

    /**
     * Скрыть pop удаления списка карточек
     */
    hideDeleteCardListPopUp() {
        Dispatcher.dispatch({
            actionName: CardListActionTypes.CARD_LIST_DELETE_HIDE,
        });
    },

};
