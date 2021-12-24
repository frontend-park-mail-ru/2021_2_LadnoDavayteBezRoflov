/**
 * Handelbars helper
 * @param {any} deadline - дедлайн
 * @return {boolean} - результат сравнения
 * @constructor
 */
export default function IsEmptyDeadlineHelper(deadline: any): boolean {
    if (deadline) {
        if (deadline === '0001-01-01T00:00') {
            return false;
        }
        return true;
    }
    return false;
};
