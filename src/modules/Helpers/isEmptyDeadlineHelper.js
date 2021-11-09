/**
 * Handelbars helper
 * @param {any} deadline - дедлайн
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsEmptyDeadlineHelper(deadline) {
    if (deadline) {
        if (deadline === '0001-01-01T00:00:00Z') {
            return false;
        }
        return true;
    }
    return false;
};
