/** Класс-контейнер для извлеченных из url данных */
class UrlData {
    /** Конструирует объект UrlData */
    constructor() {
        this.name = '';
        this.pathParams = {};
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
 * Данный класс используется для проверки шаблона URL, добавляемого в роутер.
 * URL должен иметь следующую структуру:
 * 1. Начинаться с "/".
 * 2. После начального "/" следует имя url - латинские символы, цифры и "/".
 *    Не может быть идущих подряд "/".
 * 3. Если url имеет часть с паттернами переменных, то имя url заканчивается на "/".
 *    Если паттерн-части url нет - url заканчивается на лат. символ или цифру.
 * 4. Паттерн часть состоит из блоков описывающих захватываемые значения.
 *    Захватываемое значение содержит как минимум 1 символ. Блоки разделяются "/".
 *    После завершающего блока "/" не ставится. Формат блоков: <type:varName>, где:
 *    - type: num или str (число (цифры) или строка (лат. символы и цифры) соответственно).
 *    - varName: имя переменной которая будет хранить соотв. значение (после обработки url).
 *      Имя переменной может состоять из лат. символов и цифр.
 * Пример шаблона: "/boards/show/<str:teamName>/<num:pageNo>", "/profile".
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
 * Класс позволяет выполнять проверку url на соотвествие ранее переданным шаблонам
 * и парсить path и get параметры с помощью подходящиего шаблона.
 */
class URLProcessor {
    /** Конструирует объект URLProcessor'a. */
    constructor() {
        this._templates = [];
    }

    /**
     * Обрабатывает переданный url (относительный).
     * - Проверяет валиден ли url (соотв. ли он какомому либо паттерну из ранее добавленных).
     *   Считается что patterns сформированы правильно (их следует передавать из роутера, валидируя).
     * - Берет первый подходящий паттерн и пытается извлечь значения.
     * @throws {Error} с описанием не валидности url
     * @param {string} url - относительный url для обработки
     * @return {UrlData} - данные полученные из url
     */
    process(url) {
        const path = this.getURLPath(url);
        const template = this.findTemplate(path);

        const urlData = new UrlData();
        urlData.getParams = this.getGetParams(url);
        urlData.pathParams = this.getPathParams(path, template);
        urlData.name = template.name;

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
        return urlObject.pathname.replace(URLProcessorRegEx.ClearPathEnd, '');
    }

    /**
     * Выполняет поиск шаблона подходящего под данный url.
     * @throws {Error} - если шаблон не был найден
     * @param {string} path - path часть url
     * @return {ProcessedURLTemplate} найденный шаблон
     */
    findTemplate(path) {
        const template = this._templates.find((template) => {
            this.isTemplateFit(path, template);
        });

        if (!template) {
            throw new Error(`Не найден походящий шаблон к url ${path}`);
        }

        return template;
    }

    /**
     * Определяет соотв. ли переданный path заданному шаблону
     * @param {string} path - url path
     * @param {ProcessedURLTemplate} template - шаблон урла
     * @return {boolean} соответствует ли паттерн урлу
     */
    isTemplateFit(path, template) {
        if (!path.startsWith(template.name)) {
            return false;
        }

        const variablePathPart = path.replace(template.name, '');

        if (template.captures.length === 0 && variablePathPart === '') {
            return true;
        } else if ((template.captures.length === 0 && variablePathPart !== '') ||
            (template.captures.length > 0 && variablePathPart === '') ||
            !variablePathPart.startsWith('/')) {
            return false;
        }

        const variablesCount = (variablePathPart
            .match(URLProcessorRegEx.SlashCount) || []).length;

        /* path с параметрами: name совпадает, есть "/" после name, число "/" равно числу переменных */
        return variablesCount === template.captures.length;
    }

    /**
     * Возвращает объект get параметров, полученних из относительного url
     * @param {string} url - url
     * @return {Object} содержащий get параметры
     */
    getGetParams(url) {
        const urlObject = new URL(url, URLProcessorConstants.DummyOrigin);
        return Object.fromEntries(urlObject.searchParams);
    }

    /**
     * Возвращает объект path параметров, полученних из path части url
     * @throws {Error} в случае если параметрическая часть url не корректна
     * @param {string} path - path часть url
     * @param {ProcessedURLTemplate} template - шаблон соотв. url
     * @return {Object} содержащий path параметры
     */
    getPathParams(path, template) {
        const params = {};
        const rawParams = path.replace(template.name, '').split('/').slice(1);

        const hasEmptyParams = rawParams.find((variable) => {
            return variable === '';
        });
        if (hasEmptyParams) {
            throw new Error(`Присутствуют пустые параметры в url ${path}`);
        }

        if (rawParams.length !== template.captures.length) {
            throw new Error('Ошибка в коде [getPathParams]');
        }

        template.captures.forEach((capture, index) => {
            const match = rawParams[index].match(URLProcessorRegEx.Captures[capture.type]);
            if (!match) {
                throw new Error(`В url "${path}" path переменная "${capture.name}" ` +
                                `содержит не доспустимое значение "${rawParams[index]}"`);
            }
            params[capture.name] = capture.type === URLProcessorConstants.CapturesType.number ?
                parseInt(match[0], 10) : match[0];
        });

        return params;
    }
}

const URLProcessorConstants = {
    DummyOrigin: 'https://developer.mozilla.org/', // Использую в качестве базового адреса в URL
    CapturesType: {
        string: 'str',
        number: 'num',
    },

};

const URLProcessorRegEx = {
    ClearPathEnd: /(\/*)$/, // Слеши в конце строки
    SlashCount: /\//g, // Для поиска числа слешей
    Captures: {
        [URLProcessorConstants.CapturesType.string]: /^[A-Za-z0-9]+$/,
        [URLProcessorConstants.CapturesType.number]: /^[0-9]+$/,
    },
};
