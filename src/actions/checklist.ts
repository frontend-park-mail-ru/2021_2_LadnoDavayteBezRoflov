'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher';

/**
 * Константа, содержащая в себе типы действий для checklist'ов и их элементов.
 */
export const CheckListActionTypes = {
    CHECKLIST_CREATE: 'checklist/create',
    CHECKLIST_EDIT: 'checklist/edit',
    CHECKLIST_SAVE: 'checklist/save',
    CHECKLIST_DELETE: 'checklist/delete',
    CHECKLIST_ITEM_CREATE: 'checklist/item/create',
    CHECKLIST_ITEM_EDIT: 'checklist/item/edit',
    CHECKLIST_ITEM_SAVE: 'checklist/item/save',
    CHECKLIST_ITEM_DELETE: 'checklist/item/delete',
    CHECKLIST_ITEM_TOGGLE: 'checklist/item/toggle',
};

/**
 * Объект, содержащий в себе действия в системе связанные с CheckList.
 */
export const checkListAction = {

    /**
     * Создает чеклист
     */
    createCheckList() {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_CREATE,
        });
    },

    /**
     * Удаляет чеклист по его id
     * @param {Number} chlid - id чеклиста
     */
    deleteCheckList(chlid: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_DELETE,
            data: {chlid},
        });
    },

    /**
     * Переключает заголовок чеклиста в режим редактирования
     * @param {number} chlid - id чеклиста
     */
    editCheckList(chlid: number) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_EDIT,
            data: {chlid},
        });
    },

    /**
     * Сохраняет новый заголовок чеклиста по его id
     * @param {Number} chlid - id чеклиста
     * @param {String} title - название чеклиста
     */
    saveCheckList(chlid: any, title: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_SAVE,
            data: {
                chlid,
                title,
            },
        });
    },

    /**
     * Создает элемент чеклиста
     * @param {Number} chlid - id чеклиста
     */
    createCheckListItem(chlid: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_ITEM_CREATE,
            data: {chlid},
        });
    },

    /**
     * Удаляет элемент чеклиста
     * @param {Number} chlid - id чеклиста
     * @param {Number} chliid - id элемента чеклиста
     */
    deleteCheckListItem(chlid: any, chliid: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_ITEM_DELETE,
            data: {
                chlid,
                chliid,
            },
        });
    },

    /**
     * Переключает заголовок элемента чеклиста в режим редактирования
     * @param {Number} chlid - id чеклиста
     * @param {Number} chliid - id элемента чеклиста
     */
    editCheckListItem(chlid: any, chliid: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_ITEM_EDIT,
            data: {
                chlid,
                chliid,
            },
        });
    },

    /**
     * Сохраняет новый заголовок элемента чеклиста
     * @param {Number} chlid - id чеклиста
     * @param {Number} chliid - id элемента чеклиста
     * @param {String} text - название элемента чеклиста
     */
    saveChekListItem(chlid: any, chliid: any, text: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_ITEM_SAVE,
            data: {
                chlid,
                chliid,
                text,
            },
        });
    },

    /**
     * Сохраняет новый заголовок чеклиста по его id
     * @param {Number} chlid - id чеклиста
     * @param {Number} chliid - id элемента чеклиста
     * @param {Boolean} status - статус чекбокса
     */
    toggleChekListItem(chlid: any, chliid: any, status: any) {
        Dispatcher.dispatch({
            actionName: CheckListActionTypes.CHECKLIST_ITEM_TOGGLE,
            data: {
                chlid,
                chliid,
                status,
            },
        });
    },
};
