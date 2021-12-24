import SettingsStore from '../../stores/SettingsStore/SettingsStore';

/**
 * Handelbars helper, проверяет авторство комментария
 * @param {any} author - id автора комментария
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsAuthorHelper(author: any): boolean {
    return author === SettingsStore.getContext('uid');
};
