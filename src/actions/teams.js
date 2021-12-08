'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const TeamsActionTypes = {
    POPUP_TEAM_HIDE: 'teams/popup/hide',
    POPUP_CREATE_TEAM_SHOW: 'teams/popup/create/show',
    POPUP_CREATE_TEAM_SUBMIT: 'teams/popup/create/submit',
    POPUP_EDIT_TEAM_SHOW: 'teams/popup/edit/show',
    POPUP_EDIT_TEAM_SUBMIT: 'teams/popup/edit/submit',

    POPUP_DELETE_TEAM_CHOOSE: 'teams/delete/choose',
    POPUP_DELETE_TEAM_SHOW: 'teams/delete/show',
    POPUP_DELETE_TEAM_CLOSE: 'teams/delete/close',
};

/**
 * Класс, содержащий в себе действия, связанные с управлением командами.
 */
export const teamsActions = {

    /**
     * Отобразить popup создания команды
     */
    showAddTeamPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_CREATE_TEAM_SHOW,
        });
    },

    /**
     * Отобразить popup редактирования команды
     */
    showEditTeamPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_EDIT_TEAM_SHOW,
        });
    },

    /**
     * Скрыть popup команды
     */
    hideTeamPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_TEAM_HIDE,
        });
    },

    /**
     * Создать команду
     * @param {String} teamName - название команды
     */
    submitAddTeamPopUp(teamName) {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_CREATE_TEAM_SUBMIT,
            data: {
                team_name: teamName,
            },
        });
    },

    /**
     * Переименовать команду
     * @param {String} teamName - новое название команды
     */
    submitEditTeamPopUp(teamName) {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_EDIT_TEAM_SUBMIT,
            data: {
                team_name: teamName,
            },
        });
    },

    /**
     * Отобразить popup удаления команды
     * @param {Number} tid id команды
     */
    showDeleteTeamPopUp(tid) {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_DELETE_TEAM_SHOW,
            data: {
                tid,
            },
        });
    },

    /**
     * Скрыть pop удаления команды с выбором "удалять" или "не удалять"
     * @param {Boolean} confirm подтверждено ли удаление
     */
    deleteTeam(confirm) {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_DELETE_TEAM_CHOOSE,
            data: {
                confirm,
            },
        });
    },

    /**
     * Скрыть pop удаления команды
     */
    hideDeleteCardListPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_DELETE_TEAM_CLOSE,
        });
    },
};
