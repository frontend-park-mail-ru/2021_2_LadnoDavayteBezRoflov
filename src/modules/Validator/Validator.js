/**
  * Класс, реализующий валидацию форм.
  */
export default class Validator {
    /**
     * Метод, валидирующий e-mail.
     * @param {String} source e-mail для валидации
     * @return {{status: boolean, message: String}} объект со полем статуса проверки status
     * и полем сообщением ошибки message
     */
    validateEMail(source) {
        const email = /^.*[@]+.*$/;
        if (!(email).test(source)) {
            return {error: true, message: 'Введите корректный e-mail', value: ''};
        }
        return {error: false, message: '', value: source};
    }

    /**
     * Метод, валидирующий логин.
     * @param {String} source логин для валидации
     * @return {{error: boolean, message: String}} объект со полем статуса проверки error
     * и полем сообщением ошибки message
     */
    validateLogin(source) {
        if (source.length < 3 || source.length > 20) {
            return {error: true, message: 'Введите логин длиной от 3 до 20 символов', value: ''};
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return {error: true, message: 'Введите логин, содержащий только латинские буквы', value: ''};
        }

        return {error: false, message: '', value: source};
    }

    /**
     * Метод, валидирующий пароль.
     * @param {String} source пароль для валидации
     * @return {{status: boolean, message: String}} объект со полем статуса проверки status
     * и полем сообщением ошибки message
     */
    validatePassword(source) {
        if (source.length < 6 || source.length > 25) {
            return {error: true, message: 'Введите пароль длиной от 6 до 25 символов', value: ''};
        }
        const beginWithoutDigit = /^\D.*$/;
        if (!(beginWithoutDigit).test(source)) {
            return {error: true, message: 'Введите пароль, не начинающийся с цифры', value: ''};
        }

        const withoutSpecialChars = /^[^-() /]*$/;
        if (!(withoutSpecialChars).test(source)) {
            return {error: true, message: 'Введите пароль, не содержащий специальных символов',
                    value: ''};
        }

        const containsLetters = /^.*[a-zA-Z]+.*$/;
        if (!(containsLetters).test(source)) {
            return {error: true, message: 'Введите пароль, содержащий только латинские буквы',
                    value: ''};
        }

        return {error: false, message: '', value: source};
    }
}
