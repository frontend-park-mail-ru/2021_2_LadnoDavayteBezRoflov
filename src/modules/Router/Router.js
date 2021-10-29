import {Html, Urls} from '../../constants/constants.js';

import NotFoundView from '../../views/NotFoundView/NotFoundView.js';

import BaseView from '../../views/BaseView.js';

/**
 * Роутер отсеживает переход по url, и вызывает соответствующие им view
 */
class Router {
    /**
     * @constructor
     */
    constructor() {
        this._root = document.getElementById(Html.Root);
        if (!this._root) {
            throw new Error(`Router: не найден корневой элемент с id ${Html.Root}`);
        }

        this._routes = {};
        this._currentView = undefined;
        this.registerNotFound();
    }

    /**
     * Регистрация шаблона URL. Шаблон может содержать path. переменные.
     * Синтаксис строки шаблона url описан в модуле URLProcessor в классе URLTemplateValidator.
     * @param {string} template - шаблон url'a
     * @param {BaseView} view - view url
     * @return {Router} - ссылку на объект роутера
     */
    register(template, view) {
        if (!this.isTemplateValid(template)) {
            return this;
        }

        if (!(view instanceof BaseView)) {
            return this;
        }

        this._routes[template] = view;
        return this;
    }

    /**
     * Инициализирует роутер: устанавливает обработчики событий, обрабатывает текущий url.
     */
    start() {
        this._root.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link) {
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
     * Выполняет переход по относительному url.
     * Относительный url - это часть url которая следует за именем хоста.
     * Пример: в URL "http://a.com/b/c?key=val" относительная часть - "/b/c?key=val"
     * @param {string} url - url на который следует перейти
     */
    go(url) {
        const {urlData, view} = this.processURL(url) || {};
        if (!urlData || !view) {
            this.go(Urls.NotFound);
            return;
        }

        if (this._currentView) {
            this._currentView._onHide();
        }

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

        this._currentView = view;
        view._onShow(urlData);
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
     * Регестрирует view по умолчанию для неизвестных url
     */
    registerNotFound() {
        if (!this.isTemplateValid(Urls.NotFound)) {
            throw new Error(`Шаблон ${Urls.NotFound} для NotFoundview не валидный`);
        }
        this.register(Urls.NotFound, new NotFoundView(document.getElementById(Html.Root)));
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
     * @return {Object|null}
     */
    processURL(url) {
        const getParams = this.getGetParams(url);
        const path = this.getURLPath(url);

        /* eslint-disable-next-line guard-for-in */
        for (const template in this._routes) {
            const pathParams = this.getPathParams(path, template);
            if (pathParams) {
                /* Найден подходящий шаблон и параметры: */
                return {
                    urlData: {url, pathParams, getParams},
                    view: this._routes[template],
                };
            }
        }

        return null;
    }

    /**
     * Метод пробует применить template к path и извлечь параметры
     * @param {string} path - path часть url
     * @param {string} template - шаблон url
     * @return {Object|null} возвращает объект с параметрами,
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
            if (part.startsWith('<') && part.endsWith('>')) {
                /**
                 * Если исследуемый part отвечает за захват переменной, то он имеет форму
                 * <varibleName>. Пример: "/home/page/<pageNo>" - щаблон состоит из 3х частей,
                 * 3я часть ("<pageNo>") захватывает переменную pageNo в из подходящего path.
                 * Для path'a "/home/page/100" шаблон определит, что "pageNo = 100".
                 */
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
            return true;
        }) ? params : null;
    }
}

export default new Router();
