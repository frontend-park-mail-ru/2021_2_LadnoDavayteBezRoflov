/**
 * Handelbars helper
 * @param {String} date - дата
 * @return {String} - корректный текст даты
 * @constructor
 */
export default function DateFormatHelper(date) {
    if (date) {
        const contextDate = new Date(date.substr(0, 19));
        return contextDate.toLocaleTimeString('ru-RU');
    }
    return '';
};
