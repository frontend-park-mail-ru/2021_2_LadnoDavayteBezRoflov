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
     * Действие: запрос списка досок.
     */
    getCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_GET,
            data: {
                id: id,
            },
        });
    },

    createCard(id, clid, position, title, description, deadline, checklist, assignees, tags, attachments) {
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

    updateCard(id, clid, position, title, description, deadline, checklist, assignees, tags, attachments) {
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

    deleteCard(id) {
        Dispatcher.dispatch({
            actionName: CardActionTypes.CARD_DELETE,
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
};
