'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CardActionTypes = {
    CARD_GET: 'cards/get',
    CARD_CREATE: 'cards/get',
    CARD_UPDATE: 'card/update',
    CARD_DELETE: 'card/delete',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const cardActions = {
    /**
     * Действие: запрос карточки.
     * @param {int} id - айди карточки.
     */
    getCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_GET,
            data: {
                id: id,
            },
        });
    },

    /**
     * Действие: создание карточки.
     * @param {any} id
     * @param {any} clid
     * @param {any} position
     * @param {any} title
     * @param {any} description
     * @param {any} deadline
     * @param {any} checklist
     * @param {any} assignees
     * @param {any} tags
     * @param {any} attachments
     */
    createCard(id, clid, position, title, description, deadline, checklist,
        assignees, tags, attachments) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_CREATE,
            data: {
                id: id,
                clid: clid,
                position: position,
                title: title,
                description: description,
                deadline: deadline,
                checklist: checklist,
                assignees: assignees,
                tags: tags,
                attachments: attachments,
            },
        });
    },

    /**
     * Действие: обновление карточки.
     * @param {any} id
     * @param {any} clid
     * @param {any} position
     * @param {any} title
     * @param {any} description
     * @param {any} deadline
     * @param {any} checklist
     * @param {any} assignees
     * @param {any} tags
     * @param {any} attachments
     */
    updateCard(id, clid, position, title, description, deadline, checklist,
        assignees, tags, attachments) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_UPDATE,
            data: {
                id: id,
                clid: clid,
                position: position,
                title: title,
                description: description,
                deadline: deadline,
                checklist: checklist,
                assignees: assignees,
                tags: tags,
                attachments: attachments,
            },
        });
    },

    /**
     * Действие: удаление карточки
     * @param {int} id - айди карточки.
     */
    deleteCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE,
            data: {
                id: id,
            },
        });
    },
};
