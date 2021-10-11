import ControllerInterface from '../../controllers/BaseController.js';
import NotFoundController from '../../controllers/NotFound/NotFoundController.js';
import {ConstantMessages, Html, Urls} from '../constants.js';
import {URLTemplateValidator, URLProcessor} from './URLProcessor.js';

/**
 * Класс URLData, хранящий URL
 */
export class URLData {
    /**
     * Конструктор класса URLData.
     */
    constructor() {
        this.url = '';
        this.pathParams = {};
        this.getParams = {};
    }

    /**
     * Парсит переданный url: первое значение за '/' считается url (url),
     * остальные значения за '/' - параметры url'a (urlParams),
     * также парсит get параметры (getParams)
     * @param {string} url на разбор
     * @return {URLData} коллекция распаршенных данных
     */
    static fromURL(url) {
        if (url === null) {
            throw new Error('URLData: передан пустой url');
        }

        const urlObject = new URL(url, origin);
        const data = new URLData();

        /* Path всегда имеет один "/" в начале и ни одного в конце: */
        data.url = `/${urlObject.pathname.replace(/^(\/)+|(\/)+$/g, '')}`;
        data.getParams = Object.fromEntries(urlObject.searchParams);

        return data;
    }
}

/**
 * Роутер отсеживает переход по url, и вызывает соответствующие им контроллеры
 */
class Router {
    /**
     * Конструирует роутер.
     */
    constructor() {
        this._root = document.getElementById(Html.Root);
        if (!this._root) {
            throw new Error(`Router: не найден корневой элемент с id ${Html.Root}`);
        }

        this._routes = new Map();
        this._urlProcessor = new URLProcessor();
        this.registerNotFound();
    }

    /**
     * Регистрация шаблона URL. Шаблон может содержать path. переменные.
     * Синтаксис строки шаблона url описан в модуле URLProcessor в классе URLTemplateValidator.
     * @param {string} template - шаблон url'a
     * @param {ControllerInterface} controller - контроллер url
     * @return {Router} - ссылку на объект роутера
     */
    register(template, controller) {
        const validator = new URLTemplateValidator(template);
        validator.validate();
        this._urlProcessor.pushProcessedTemplate(validator.processedTemplate);

        if (!(controller instanceof ControllerInterface)) {
            throw new Error('Router: контроллер должен реализовывать ControllerInterface');
        }

        this._routes.set(validator.processedTemplate.name, controller);
        return this;
    }

    /**
     * Инициализирует роутер: устанавливает обработчики событий, обрабатывает текущий url.
     */
    start() {
        this._root.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link instanceof HTMLAnchorElement) {
                event.preventDefault();
                this.go(link.pathname);
            }
        });

        window.addEventListener('popstate', (event) => {
            this.go(window.location.pathname);
        });

        this.go(window.location.pathname);
    }

    /**
     * Выполняет переход по относительному url
     * @param {string} url - url на который следует перейти
     */
    go(url) {
        let urlData = undefined;
        try {
            urlData = this._urlProcessor.process(url);
        } catch (exception) {
            console.log(`Router: url ${url} не может быть обработан: "${exception.message}"`);
            this.go(Urls.NotFound);
            return;
        }

        const controller = this._routes.get(urlData.name);
        if (!controller) {
            console.log(`Router: не найден контроллер для url "${data.url}"`);
            this.go(Urls.NotFound);
            return;
        }

        controller.work(urlData);

        /**
         * Отсекаем добавление записей в историю для случаев:
         * - Второй раз подряд нажимаем одну и туже ссылку (переходим по URL)
         * - Сработало событие popstate, и в истоии уже есть актуальная запись
         *   (иначе же будет добавлена ее копия, а следующий back приведет на текущий URl и т.д.)
         */
        if (window.location.pathname !== url) {
            /**
             * Добавляет запись в историю и делает ее активной.
             * Не приводит к срабатыванию popstate.
             */
            window.history.pushState(null, null, url);
        }
    }

    /**
     * Возврат на предыдущий URL в истории
     */
    prev() {
        window.history.back();
    }

    /**
     * Переход на следующий URL в истории
     */
    toNext() {
        window.history.forward();
    }

    /**
     * Регестрирует контроллер по умолчанию для неизвестных url
     */
    registerNotFound() {
        this.register(Urls.NotFound, new NotFoundController(document.getElementById(Html.Root)));
    }
}

export default new Router();
