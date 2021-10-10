/** Класс-контейнер для извлеченных из url данных */
class UrlData {
    /** Конструирует объект UrlData */
    constructor() {
        this.name = '';
        this.urlParams = {};
        this.getParams = {};
    }
}

/** Класс-контейнер для элементов url template */
class ProcessedURLTemplate {
    /** Конструирует объект ProcessedURLTemplate */
    constructor() {
        this.name = '';
        this.captures = []; // {type, name}
    }
}

/**
 * Данный класс используется для проверки URL, добавляемого в роутер.
 * URL должен иметь следующую структуру:
 * 1. Начинаться с "/".
 * 2. После начального "/" следует имя url - латинские символы, цифры и "/".
 *    Не может быть идущих подряд "/".
 * 3. Если url имеет часть с паттернами переменных, то имя url заканчивается на "/".
 *    Если паттерн-части url нет - url заканчивается на лат. символ или цифру.
 * 4. Паттерн часть состоит из блоков описывающих захватываемые значения. Блоки разделяются "/",
 *    После завершающего блока "/" не ставится. Формат блоков: <type:varName>, где:
 *    - type: num или str (число (цифры) или строка (лат. символы и цифры) соответственно).
 *    - varName: имя переменной которая будет хранить соотв. значение (после обработки url).
 *      Имя переменной может состоять из лат. символов и цифр.
 * Пример url: "/boards/show/<str:teamName>/<num:pageNo>", "/profile".
 */
class URLTemplateValidator {
    /** Getter, возвращающий объект с составляющими url шаблона */
    get processedTemplate() {
        return this._processedTemplate;
    }

    /** Getter, возвращает результат валидации шаблона url. */
    get isValid() {
        return this._isValid;
    }

    /** Возвращает причину не валидности паттерна, если processedTemplate === true */
    get errorDescription() {
        return this._errorDescription;
    }

    /**
     * Валидирует переданный url. Резуьтаты проверки и сообщение,
     * (в случае не пройденной валидации) доступны в полях isValid и errorDescription.
     * @param {string} url - проверяемый url
     */
    constructor(url) {
        this._processedTemplate = new ProcessedURLTemplate();
        this._isValid = false;
        this._errorDescription = '';
    }
}

/**
 * Класс выполняет проверку и парсинг данных из url, согласно переданным в конструкторе паттернам.
 * Результаты проверки и данные доступны в соответствующих полях.
 */
class URLProcessor {
    /** Конструирует объект URLProcessor'a. */
    constructor() {
        this._templates = [];
    }

    /**
     * Обрабатывает переданный url.
     * - Проверяет валиден ли url (соотв. ли он какомому либо паттерну из patterns).
     * Считается что patterns сформированы правильно (их следует передавать из роутера).
     * - Берет первый подходящий паттерн и пытается извлечь значения.
     * @param {string} url - url для обработки
     * @return {UrlData} - данные полученные из url
     */
    process(url) {
        const urlData = new UrlData();
        const path = this.getURLPath(url);
        const template = this.findTemplate(path);
        if (!template) {
            throw new Error('Не найден походящий шаблон url\'a');
        }


        // Для каждого паттерна из patterns проверяем, стартует ли url с какой-либо name части.
        // Да - работаем дальше. Нет - выставляем в невалидное состояние.
        // Отсекаем часть урла соотв. name части. Сплитим по слешу отсальные части url.
        // Проверяем каждую оставшуюся часть на соответствие соотв. match элемента.
        // Если что-то не проходит - не валидное состояние. Каждый ОК блок урла записываем в поле данных.
        // Отмечаем что состояние валидное и можно работать далее, брать данные.
        return urlData;
    }

    /**
     * Добавляет в конец списка паттернов template
     * @param {ProcessedURLTemplate} template - объект ProcessedURLTemplate
     */
    pushProcessedTemplate(template) {
        this._templates.push(template);
    };

    // private:
    /**
     * Извлекает из относительного URL path часть
     * @param {string} url - url для обработки
     * @return {string} - path часть url
     */
    getURLPath(url) {
        const urlObject = new URL(url, URLProcessorConstants.DummyOrigin);
        return urlObject.pathname;
    }

    /**
     * Ищет походящий шаблон урла для переданного path url'a
     * @param {string} path - path часть url'a
     * @return {null | ProcessedURLTemplate} - найденный паттерн url'a или null
     */
    findTemplate(path) {
        const found = null;
        for (const template of this._templates) {

        }
        return found;
    }

}

const URLProcessorConstants = {
    DummyOrigin: 'https://developer.mozilla.org/', // Использую в качестве базового адреса в URL
};
