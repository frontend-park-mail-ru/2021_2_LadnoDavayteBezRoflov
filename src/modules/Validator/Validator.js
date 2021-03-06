import {ConstantMessages} from '../../constants/constants.js';

/**
 * Класс, реализующий валидацию форм.
 */
export default class Validator {
    /**
     * @constructor
     */
    constructor() {
        this.maxImageSize = 500 * 1024; // 500 MB
    }

    /**
     * Метод, валидирующий e-mail.
     * @param {String} source e-mail для валидации
     * @return {String | null} сообщение об ошибке
     */
    validateEMail(source) {
        const email = /^.*[@]+.*$/;
        if (!(email).test(source)) {
            return ConstantMessages.EnterCorrectEmail;
        }
        return null;
    }

    /**
     * Метод, валидирующий логин.
     * @param {String} source логин для валидации
     * @return {String | null} сообщение об ошибке
     */
    validateLogin(source) {
        if (source.length < 3 || source.length > 20) {
            return ConstantMessages.WrongLoginLength;
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return ConstantMessages.UseOnlyLatinLettersLogin;
        }

        return null;
    }

    /**
     * Метод, валидирующий пароль.
     * @param {String} source пароль для валидации
     * @return {String | null} сообщение об ошибке
     */
    validatePassword(source) {
        if (source.length < 6 || source.length > 25) {
            return ConstantMessages.WrongPasswordLength;
        }
        const beginWithoutDigit = /^\D.*$/;
        if (!(beginWithoutDigit).test(source)) {
            return ConstantMessages.NotBeginningWithNumberPassword;
        }

        const withoutSpecialChars = /^[^-() /]*$/;
        if (!(withoutSpecialChars).test(source)) {
            return ConstantMessages.NoSpecialSymbolsPassword;
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return ConstantMessages.UseOnlyLatinLettersPassword;
        }

        return null;
    }

    /**
     * Метод, валидирующий размер аватара;
     * @param {File} source аватар
     * @return {String | null} сообщение об ошибке
     */
    validateAvatar(source) {
        if (source.size > this.maxImageSize) {
            return ConstantMessages.AvatarTooBig;
        }
        return null;
    }

    /**
     * Метод, валидирующий название доски
     * @param {String} title заглавие на проверку
     * @return {String | null}
     */
    validateBoardTitle(title) {
        if (title.length < 1) {
            return ConstantMessages.BoardTitleTooShort;
        }
        if (title.length > 60) {
            return ConstantMessages.BoardTitleTooLong;
        }
        return null;
    }

    /**
     * Метод, валидирующий название команды
     * @param {String} title название на проверку
     * @return {String | null}
     */
    validateTeamTitle(title) {
        if (title.length < 1) {
            return ConstantMessages.TeamTitleTooShort;
        }
        if (title.length > 60) {
            return ConstantMessages.TeamTitleTooLong;
        }
        return null;
    }

    /**
     * Метод, валидирующий описание доски
     * @param {String} description описание на проверку
     * @return {String | null}
     */
    validateBoardDescription(description) {
        if (description.length > 500) {
            return ConstantMessages.BoardDescriptionTooLong;
        }
        return null;
    }

    /**
     * Метод, валидирующий название списка карточек
     * @param {String} title заглавие на проверку
     * @return {String | null}
     */
    validateCardListTitle(title) {
        if (title.length < 1) {
            return ConstantMessages.CardListTitleTooShort;
        }
        if (title.length > 40) {
            return ConstantMessages.CardListTitleTooLong;
        }
        return null;
    }

    /**
     * Метод, валидирующий название карточки
     * @param {String} title заглавие на проверку
     * @return {String | null}
     */
    validateCardTitle(title) {
        if (title.length < 1) {
            return ConstantMessages.CardTitleTooShort;
        }
        if (title.length > 40) {
            return ConstantMessages.CardTitleTooLong;
        }
        return null;
    }

    /**
     * Метод, валидирующий дату дедлайна
     * @param {String} deadline дедлайн в строковом формате
     * @param {boolean} deadlineCheck статус дедлайна (выполнено | не выполнено)
     * @return {String} 'invalid' или 'valid'
     */
    validateDeadline(deadline, deadlineCheck) {
        const deadlineDate = new Date(deadline);
        const timeNow = new Date();

        if (deadlineCheck) {
            return 'completed';
        }

        const dateDiff = (deadlineDate.getTime() - timeNow.getTime()) / (1000 * 3600 * 24);

        return (deadlineDate <= timeNow) ?
            'invalid' :
            (dateDiff > 1.0) ?
                'valid' :
                'expiring';
    }

    /**
     * Метод, валидирующий дедлайн
     * @param {String} deadline
     * @return {String} дедлайн, максимальный дедлайн или пустая строка.
     */
    validateDeadlineInput(deadline) {
        if (deadline) {
            const date = new Date(deadline);
            if (isNaN(date)) {
                return '3000-12-31T23:59';
            }
            return deadline;
        }
        return '';
    }

    /**
     * Метод, валидирующий название тега
     * @param {String} title заглавие на проверку
     * @return {String | null}
     */
    validateTagTitle(title) {
        if (!title || title.length === 0 || title.length > 40) {
            return ConstantMessages.WrongTagNameLength;
        }
        return null;
    }
}
