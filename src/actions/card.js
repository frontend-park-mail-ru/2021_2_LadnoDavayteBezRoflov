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
     * @param {Number} pos позиция на доске
     * @param {String} title заголовок
     * @param {String} description описание
     * @param {Number} cid id карточки
     * @param {Number} bid id доски
     * @param {Number} clid id списка карточек
     */
    updateCard(pos, title, description, cid, bid, clid) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_UPDATE_SUBMIT,
            data: {
                card_name: title,
                description,
                pos,
                cid,
                bid,
                clid,
            },
        });
    },

    /**
     * Создает карточку
     * @param {String} title заголовок
     * @param {String} description описание
     */
    createCard(title, description) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_CREATE_SUBMIT,
            data: {
                card_name: title,
                description,
                // deadline,
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
};
