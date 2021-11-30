'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для настроек.
 */
export const SettingsActionTypes = {
    SETTINGS_GET: 'settings/get',
    SETTINGS_UPDATE: 'settings/put',
    AVATAR_UPLOAD: 'avatar/post',
    NAVBAR_MENU_BTN_CLICK: 'navbar/menu-btn/click',
};

/**
 * Константа, содержащая в себе действия, связанные с настройками.
 */
export const settingsActions = {
    /**
     * Действие: запрос актуальных настроек пользователя.
     * @param {String} userName
     */
    getSettings(userName) {
        Dispatcher.dispatch({
            actionName: SettingsActionTypes.SETTINGS_GET,
            data: {userName},
        });
    },

    /**
     * Действие: обновление настроек пользователя.
     * @param {FormData} data
     */
    putSettings(data) {
        Dispatcher.dispatch({
            actionName: SettingsActionTypes.SETTINGS_UPDATE,
            data,
        });
    },

    /**
     * Действие: загрузка новой аватарки пользователя.
     * @param {File|String} avatar аватар (файл или ссылка на блоб)
     */
    uploadAvatar(avatar) {
        Dispatcher.dispatch({
            actionName: SettingsActionTypes.AVATAR_UPLOAD,
            data: {avatar},
        });
    },

    /**
     * Действие: переключение видимости navbar menu
     */
    toggleNavbarMenu() {
        Dispatcher.dispatch({
            actionName: SettingsActionTypes.NAVBAR_MENU_BTN_CLICK,
        });
    },
};
