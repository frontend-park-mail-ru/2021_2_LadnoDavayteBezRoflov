'use strict';

// Modules
import Dispatcher from '../modules/Dispatcher/Dispatcher.js';

/**
 * Константа, содержащая в себе типы действий для работы с тегами.
 */
export const TagsActionTypes = {
    /* Список тегов (в случае карточки и в случае доски) */
    SHOW_LIST_POPUP_BOARD: 'tags/list-popup/show/board',
    SHOW_LIST_POPUP_CARD: 'tags/list-popup/show/card',
    HIDE_LIST_POPUP: 'tags/list-popup/hide',

    /* Окно редактирования/создания тега */
    SHOW_TAG_POPUP_EDIT: 'tags/tag-popup/edit/show',
    SHOW_TAG_POPUP_CREATE: 'tags/tag-popup/create/show',
    HIDE_TAG_POPUP: 'tags/tag-popup/hide',
    CREATE_TAG: 'tags/create',
    DELETE_TAG: 'tags/delete',
    UPDATE_TAG: 'tags/update',
    PICK_COLOR: 'tags/pick-color',

    /* Переключение тега у карточки */
    TOGGLE_TAG: 'tags/toggle',
    EDIT_TAG_NAME: 'tags/editname',
};

/**
 * Класс, содержащий в себе действия для работы с тегами.
 */
export const tagsActions = {

    /**
     * Отображает окно со списком тегов, при нажатии на кнопку тегов на доске
     */
    showTagListPopUpBoard() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.SHOW_LIST_POPUP_BOARD,
        });
    },

    /**
     * Отображает окно со списком тегов, при нажатии на кнопку добавить тег на карточке
     */
    showTagListPopUpCard() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.SHOW_LIST_POPUP_CARD,
        });
    },

    /**
     * Скрывает окно со списком тегов
     */
    hideTagListPopUp() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.HIDE_LIST_POPUP,
        });
    },

    /**
     * Отображает окно редактирования тега
     * @param {Number} tgid id тега
     */
    showTagEditPopUp(tgid) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.SHOW_TAG_POPUP_EDIT,
            data: {tgid},
        });
    },

    /**
     * Отображает окно создания тега
     */
    showTagCreatePopUp() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.SHOW_TAG_POPUP_CREATE,
        });
    },

    /**
     * Скрывает окно тега
     */
    hideTagPopUp() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.HIDE_TAG_POPUP,
        });
    },

    /**
     * Создает тег
     * @param {String} tagName название тега
     */
    createTag(tagName) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.CREATE_TAG,
            data: {
                tag_name: tagName,
            },
        });
    },

    /**
     * Удаляет тег
     */
    deleteTag() {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.DELETE_TAG,
        });
    },

    /**
     * Обновляет тег
     */
    updateTag(tagName) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.UPDATE_TAG,
        });
    },

    /**
     * Переключает тег у карточки
     * @param {Number} tgid id тега
     */
    toggleTag(tgid) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.TOGGLE_TAG,
            data: {tgid},
        });
    },

    /**
     * Выбирает цвет для текущего, редактируемого тега
     * @param {Number} clrid id цвета
     */
    pickColor(clrid) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.PICK_COLOR,
            data: {clrid},
        });
    },

    /**
     * Обновляет в сторе редактируемое имя тега
     * @param {String} tagName название тега
     */
    editTagName(tagName) {
        Dispatcher.dispatch({
            actionName: TagsActionTypes.EDIT_TAG_NAME,
            data: {tag_name: tagName},
        });
    },
};
