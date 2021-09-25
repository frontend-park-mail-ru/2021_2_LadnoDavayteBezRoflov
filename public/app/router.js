import { constants } from './constants.js';
import { ControllerInterface } from '../controllers/baseController.js'
import { NotFoundController } from '../controllers/notFoundController.js';

export class URLData {    
    constructor() {
        this.url = '';
        this.urlParams = [];
        this.getParams = {};
    }

    /**
     * Парсит переданный url: первое значение за '/' считается url (url), 
     * остальные значения за '/' - параметры url'a (urlParams), 
     * также парсит get параметры (getParams)
     * @param {string} url на разбор
     * @returns {URLData} коллекция распаршенных данных
     */
    static fromURL(url) {
        if (url == null) {
            throw new Error('URLData: передан пустой url');
        }

        let urlObject = new URL(url, origin);
        let data = new URLData;

        /* Очищаем path от лишних элементов: */
        let pathElements = urlObject.pathname.replace(/^\/|\/\/|\/$/g, '').split('/');
        data.url = '/' + pathElements[0];
        data.urlParams = pathElements.slice(1);
        data.getParams = Object.fromEntries(urlObject.searchParams);
        
        return data;
    }
}

/**
 * Роутер отсеживает переход по url, и вызывает соответствующие им контроллеры
 */
export class Router {
    /**
     * Конструирует роутер.
     */
    constructor() {
        this.root = document.getElementById(constants.elementsID.appRoot);
        if (this.root == null) {
            throw new Error(`Router: не найден корневой элемент с id ${constants.elementsID.appRoot}`);
        }
        this.routes = new Map;
        this.registerNotFound();
    }

    /**
     * Регистрация URL'a и соответствующего ему контроллера.
     * @param {string} url - url
     * @param {ControllerInterface} controller - контроллер url
     * @returns {Router} cсылку на this
     */
    registerUrl(url, controller) {
        if ((url.match(/\//g) || []).length != 1 || url[0] != '/') {
            throw new Error('Router: регестрируемый url должен соотв. шаблону "/path_name"');
        }
        if (!(controller instanceof ControllerInterface)) {
            throw new Error('Router: контроллер должен реализовывать ControllerInterface');
        }
        this.routes.set(url, controller);
        return this;
    }

    /**
     * Добавление alias'a на уже зарегестрированный url. (например '/home' для '/').
     * Методом можно воспользоваться, что бы не создавать дополнительный объект контроллера.
     * @param {string} url - ранее
     * @param {string} alias  - alias на url
     * @throws Error, если url не был ранее зарегестрирован.
     * @returns {Router} cсылку на this
     */
    registerUrlAlias(url, alias) {
        let controller = this.routes.get(url);
        if (controller == null) {
            throw new Error(`Router: ошибка при установке alias'a на "${url}": контроллер не существует.`)
        }
        this.routes.set(alias, controller);
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
                this.toUrl(target.href);
            }
        });

        window.addEventListener('popstate', (event) => {
            this.toUrl(location.href);
        });

        this.toUrl(location.href);
    }

    /**
     * Переход по URL.
     * @param {string} url 
     */
     toUrl(url) {
        window.history.pushState(null, '', url);

        let data = URLData.fromURL(url);
        let controller = this.routes.get(data.url);

        if (controller == null) {
            console.log(`Router: не найден контроллер для url'a <${data.url}>`);
            this.toUrl(constants.urls.notFound);
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
        this.registerUrl(constants.urls.notFound, new NotFoundController);
    }

}

export const router = new Router;
