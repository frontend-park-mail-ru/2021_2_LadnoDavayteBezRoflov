'use strict';

/**
  * Класс, реализующий валидацию форм.
  */
export default class Validator {
    /**
     * Метод, валидирующий e-mail.
     * @param {String} source e-mail для валидации
     * @returns {{status: boolean, message: String}} объект со полем статуса проверки status и полем сообщением ошибки message
     */
    validateEMail(source) {
        const email = /@/;
        if (!(email).test(source)) {
            return {status: false, message: 'Введите корректный e-mail'};
        }
        return {status: true, message: ''};
    }

    /**
     * Метод, валидирующий логин.
     * @param {String} source логин для валидации
     * @returns {{status: boolean, message: String}} объект со полем статуса проверки status и полем сообщением ошибки message
     */
    validateLogin(source) {
        if (source.length < 3 || source.length > 20) {
            return {status: false, message: 'Введите логин длиной от 3 до 20 символов'};
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return {status: false, message: 'Введите логин, содержащий только латинские буквы'};
        }

        return {status: true, message: ''};
    }

    /**
     * Метод, валидирующий пароль.
     * @param {String} source пароль для валидации
     * @returns {{status: boolean, message: String}} объект со полем статуса проверки status и полем сообщением ошибки message
     */
    validatePassword(source) {
        if (source.length < 6 || source.length > 25) {
            return {status: false, message: 'Введите пароль длиной от 6 до 25 символов'};
        }
        const beginWithoutDigit = /^\D.*$/;
        if (!(beginWithoutDigit).test(source)) {
            return {status: false, message: 'Введите пароль, не начинающийся с цифры'};
        }

        const withoutSpecialChars = /^[^-() /]*$/;
        if (!(withoutSpecialChars).test(source)) {
            return {status: false, message: 'Введите пароль, не содержащий специальных символов'};
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return {status: false, message: 'Введите пароль, содержащий только латинские буквы'};
        }

        return {status: true, message: ''};
    }
}
