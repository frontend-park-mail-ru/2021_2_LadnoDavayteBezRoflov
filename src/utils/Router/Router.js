import ControllerInterface from '../../controllers/BaseController.js';
import NotFoundController from '../../controllers/NotFound/NotFoundController.js';
import {Html, Urls} from '../constants.js';

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
        this.root = document.getElementById(Html.Root);
        if (this.root == null) {
            throw new Error(`Router: не найден корневой элемент с id ${Html.Root}`);
        }

        this.routes = new Map();
        this.registerNotFound();
    }

    /**
     * Регистрация URL'a и соответствующего ему контроллера.
     * @param {string} url - url
     * @param {ControllerInterface} controller - контроллер url
     * @return {Router} cсылку на this
     */
    registerUrl(url, controller) {
        if ((url.match(/\//g) || []).length !== 1 || url[0] !== '/') {
            throw new Error('Router: регестрируемый url должен соотв. шаблону "/path_name"');
        }

        if (!(controller instanceof ControllerInterface)) {
            throw new Error('Router: контроллер должен реализовывать ControllerInterface');
        }

        this.routes.set(url, controller);
        return this;
    }

    /**
     * Инициализирует роутер: устанавливает обработчики событий, обрабатывает текущий url.
     */
    route() {
        this.root.addEventListener('click', (event) => {
            const {target} = event;
            if (target instanceof HTMLAnchorElement) {
                event.preventDefault();
                this.toUrl(target.pathname);
            }
        });

        window.addEventListener('popstate', (event) => {
            event.preventDefault();
            this.toUrl(location.pathname);
        });

        this.toUrl(location.pathname);
    }

    /**
     * Переход по URL.
     * @param {string} url
     */
    toUrl(url) {
        if (location.pathname !== url) {
            history.pushState(null, null, url);
        }

        const data = URLData.fromURL(url);
        const controller = this.routes.get(data.url);

        if (controller === undefined) {
            console.log(`Router: не найден контроллер для url'a "${data.url}"`);
            this.toUrl(Urls.NotFound);
            return;
        }

        controller.work(data);
    }

    /**
     * Возврат на предыдущий URL в истории
     */
    toPrev() {
        window.history.back();
    }

    /**
     * Переход на следующий URL в истории
     */
    toNext() {
        window.history.forward();
    }

    /**
     * Регестрирует контроллер по умолчанию
     */
    registerNotFound() {
        this.registerUrl(Urls.NotFound, new NotFoundController(document.getElementById(Html.Root)));
    }
}

export default new Router();
