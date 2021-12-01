import SettingsStore from '../../stores/SettingsStore/SettingsStore.js';

/**
 * Handelbars helper, проверяет авторство комментария
 * @param {any} author - id автора комментария
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsAuthorHelper(author) {
    return author === SettingsStore.getContext('uid');
};
