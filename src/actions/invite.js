'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для ссылок-приглашений
 */
export const InviteActionTypes = {
    GO_BOARD_INVITE: 'go/invite/board',
    GO_CARD_INVITE: 'go/invite/card',
    REFRESH_BOARD_LINK: 'refresh/invite/board',
    REFRESH_CARD_LINK: 'refresh/invite/card',
    COPY_BOARD_LINK: 'copy/invite/board',
    COPY_CARD_LINK: 'copy/invite/card',
};

/**
 * Объект, содержащий в себе действия в системе связанные с приглашениями.
 */
export const inviteActions = {

    /**
     * Приглашает пользователя в доску
     * @param {String} accessPath
     */
    openBoardInvite(accessPath) {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.GO_BOARD_INVITE,
            data: {accessPath},
        });
    },

    /**
     * Приглашает пользователя в карточку
     * @param {String} accessPath
     */
    openCardInvite(accessPath) {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.GO_CARD_INVITE,
            data: {accessPath},
        });
    },

    /**
     * Обновляет ссылку приглашение на доску
     */
    refreshBoardInvite() {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.REFRESH_BOARD_LINK,
        });
    },

    /**
     * Обновляет ссылку приглашение на карточку
     */
    refreshCardInvite() {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.REFRESH_CARD_LINK,
        });
    },

    /**
     * Скопировать приглашение на доску
     */
    copyBoardInvite() {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.COPY_BOARD_LINK,
        });
    },

    /**
     * Скопировать приглашение на карточку
     */
    copyCardInvite() {
        Dispatcher.dispatch({
            actionName: InviteActionTypes.COPY_CARD_LINK,
        });
    },
};
