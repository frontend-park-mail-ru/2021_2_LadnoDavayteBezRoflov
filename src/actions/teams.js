'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const TeamsActionTypes = {
    POPUP_CREATE_TEAM_SHOW: 'teams/popup/create/show',
    POPUP_CREATE_TEAM_HIDE: 'teams/popup/create/hide',
    POPUP_CREATE_TEAM_SUBMIT: 'teams/popup/create/submit',
};

/**
 * Класс, содержащий в себе действия, иницируемые с BoardView.
 */
export const teamsActions = {

    /**
     * Отобразить popup создания доски
     */
    showAddTeamPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_CREATE_TEAM_SHOW,
        });
    },

    /**
     * Скрыть popup создания доски
     */
    hideAddTeamPopUp() {
        Dispatcher.dispatch({
            actionName: TeamsActionTypes.POPUP_CREATE_TEAM_HIDE,
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
};
