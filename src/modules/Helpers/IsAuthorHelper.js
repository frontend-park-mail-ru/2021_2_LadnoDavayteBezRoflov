import UserStore from '../../stores/UserStore/UserStore.js';

/**
 * Handelbars helper, проверяет авторство комментария
 * @param {any} author - логин автора комментария
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsAuthorHelper(author) {
    return author === UserStore.getContext('userName');
};
