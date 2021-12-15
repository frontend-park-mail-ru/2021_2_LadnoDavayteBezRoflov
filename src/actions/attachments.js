'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для списка досок.
 */
export const AttachmentsActionTypes = {
    UPLOAD: 'attach/upload',
    DELETE: 'attach/delete',
    DOWNLOAD: 'attach/download',
};

/**
 * Класс, содержащий в себе действия в системе.
 */
export const attachmentsActions = {
    /**
     * Загружает файл вложения
     * @param {File} file файл вложения
     */
    uploadAttachment(file) {
        Dispatcher.dispatch({
            actionName: AttachmentsActionTypes.UPLOAD,
            data: {file},
        });
    },

    /**
     * Удаляет файл вложения
     * @param {Number} atid id вложения
     */
    deleteAttachment(atid) {
        Dispatcher.dispatch({
            actionName: AttachmentsActionTypes.DELETE,
            data: {atid},
        });
    },

    /**
     * Скачивает файл вложения
     * @param {Number} atid id вложения
     */
    downloadAttachment(atid) {
        Dispatcher.dispatch({
            actionName: AttachmentsActionTypes.DOWNLOAD,
            data: {atid},
        });
    },
};
