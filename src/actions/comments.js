'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const CommentsActionTypes = {
    CARD_ADD_COMMENT: 'card/comment/add',
    CARD_EDIT_COMMENT: 'card/comment/edit',
    CARD_UPDATE_COMMENT: 'card/comment/update',
    CARD_DELETE_COMMENT: 'card/comment/delete',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const commentsActions = {
    /**
     * Создает комментарий
     * @param {Number} cid id карточки
     * @param {String} text текст комментария
     */
    createComment(cid, text) {
        Dispatcher.dispatch({
            actionName: CommentsActionTypes.CARD_ADD_COMMENT,
            data: {
                cid,
                text,
            },
        });
    },

    /**
     * Удалить комментарий (не спрашиваем, хотим ли)
     * @param {Number} cmid id комментария
     */
    deleteComment(cmid) {
        Dispatcher.dispatch({
            actionName: CommentsActionTypes.CARD_DELETE_COMMENT,
            data: {cmid},
        });
    },

    /**
     * Переключает комментарий в режим редактирования
     * @param {Number} cmid id комментария
     */
    editComment(cmid) {
        Dispatcher.dispatch({
            actionName: CommentsActionTypes.CARD_EDIT_COMMENT,
            data: {cmid},
        });
    },

    /**
     * Обновляет список карточек
     * @param {String} text текст комментария
     * @param {Number} cmid id комментария
     */
    updateComment(text, cmid) {
        Dispatcher.dispatch({
            actionName: CommentsActionTypes.CARD_UPDATE_COMMENT,
            data: {
                text,
                cmid,
            },
        });
    },
};
