import ControllerInterface from '../../controllers/BaseController.js';
import NotFoundController from '../../controllers/NotFound/NotFoundController.js';
import {Html, Urls} from '../constants.js';

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

        this._routes = {};
        this._currentController = undefined;
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
        if (!this.isTemplateValid(template)) {
            return this;
        }

        if (!(controller instanceof ControllerInterface)) {
            return this;
        }

        this._routes[template] = controller;
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
                this.go(link.pathname + link.search);
            }
        });

        window.addEventListener('popstate', (event) => {
            this.go(window.location.pathname + window.location.search);
        });

        this.go(window.location.pathname + window.location.search);
    }

    /**
     * Выполняет переход по относительному url
     * @param {string} url - url на который следует перейти
     */
    go(url) {
        const urlData = this.processURL(url);
        if (!urlData) {
            this.go(Urls.NotFound);
            return;
        }

        const controller = this._routes[urlData.template];
        if (!controller) {
            this.go(Urls.NotFound);
            return;
        }

        if (this._currentController) {
            this._currentController.onDeactivating();
        }
        this._currentController = controller;
        controller.work(urlData);

        /**
         * Отсекаем добавление записей в историю для случаев:
         * - Второй раз подряд нажимаем одну и туже ссылку (переходим по URL)
         * - Сработало событие popstate, и в истоии уже есть актуальная запись
         *   (иначе же будет добавлена ее копия, а следующий back приведет на текущий URl и т.д.)
         */
        if (window.location.pathname + window.location.search !== url) {
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
        if (!this.isTemplateValid(Urls.NotFound)) {
            throw new Error(`Шаблон ${Urls.NotFound} для NotFoundController не валидный`);
        }
        this.register(Urls.NotFound, new NotFoundController(document.getElementById(Html.Root)));
    }

    /**
     * Проверяет соответствие шаблона минимуму критериев
     * @param {string} template - проверяемый шаблон
     * @return {boolean} результат проверки
     */
    isTemplateValid(template) {
        /* Все url стартуют с "/" */
        return !(!template.startsWith('/') ||
                /* Не должно быть пустых имен параметров */
                (template.search('/<>/') !== -1 || template.search('/<>') !== -1) ||
                /* Шаблон url не заканчивается на "/" */
                (template !== '/' && template.endsWith('/')));
    }

    /**
     * Извлекает из относительного URL path часть. Если присутствет завершающий "/", он будет удален.
     * @param {string} url - url для обработки
     * @return {string} - path часть url
     */
    getURLPath(url) {
        const urlObject = new URL(url, window.location.origin);
        return urlObject.pathname === '/' ? '/' : urlObject.pathname.replace(/\/$/, '');
    }

    /**
     * Возвращает объект get параметров, полученних из относительного url
     * @param {string} url - url
     * @return {Object} содержащий get параметры
     */
    getGetParams(url) {
        const urlObject = new URL(url, window.location.origin);
        return Object.fromEntries(urlObject.searchParams);
    }

    /**
     * Обрабатывает переданный url (относительный). Извлекает path и get параметры.
     * @param {string} url
     * @return {Object|undefined}
     */
    processURL(url) {
        const urlData = {getParams: this.getGetParams(url)};
        const path = this.getURLPath(url);

        return Object.entries(this._routes).every(([template]) => {
            urlData.pathParams = this.getPathParams(path, template);
            /* Найден подходящий шаблон и параметры: */
            if (urlData.pathParams) {
                urlData.template = template;
                return false;
            }
            return true;
        }) ? null : urlData;
    }

    /**
     * Метод пробует применить template к path и извлечь параметры
     * @param {string} path - path часть url
     * @param {string} template - шаблон url
     * @return {Object|undefined} возвращает объект с параметрами,
     * либо, если path не соотв. template - undefined
     */
    getPathParams(path, template) {
        /* Разделяем path и template на элементы - подстроки ограниченные "/". */
        const pathElements = path.split('/');
        const templateElements = template.split('/');

        if (pathElements.length !== templateElements.length) {
            return null;
        }

        const params = {};

        /* Проверяем каждый "элемент" шаблона и path'a: */
        return templateElements.every((part, index) => {
            /**
             * Если исследуемый part отвечает за захват переменной, то он имеет форму
             * <varibleName>. Пример: "/home/page/<pageNo>" - щаблон состоит из 3х частей,
             * 3я часть ("<pageNo>") захватывает переменную pageNo в из подходящего path.
             * Для path'a "/home/page/100" шаблон определит, что "pageNo = 100".
             */
            if (part.startsWith('<') && part.endsWith('>')) {
                const key = part.slice(1, part.length - 1);
                const value = pathElements[index];
                params[key] = Number(value) || value;
            } else if (part !== pathElements[index]) {
                /**
                 * Если же part это обычная часть шаблона (как "home" и "page" части из примера выше),
                 * то у подходящего под template path'a также должна совпадать соотв. часть.
                 */
                return false;
            }
        }) ? params : null;
    }
}

export default new Router();
