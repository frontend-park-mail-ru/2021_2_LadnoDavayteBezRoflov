/**
 * Handelbars helper
 * @param {String} date - дата
 * @return {String} - корректный текст даты
 * @constructor
 */
 export default function DateFormatHelper(date) {
    if (date) {
        const contextDate = new Date(date);
        return contextDate.toLocaleTimeString('ru-RU');
    }
    return '';
};
