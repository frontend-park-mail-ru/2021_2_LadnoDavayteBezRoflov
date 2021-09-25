import { constants } from "./constants.js";

/* Задача роутера: следить за именением ссылки и вызывать тот или иной метод контроллера */


class URLData {    
    constructor() {
        this.url = '';
        this.urlParams = [];
        this.getParams = {};
    }

    /**
     * Парсит переданный url: первое значение за '/' считается url (url), 
     * остальные значения за '/' - параметры url'a (urlParams), 
     * также парсит get параметры в объект
     * @param {string} url на разбор
     * @returns {URLData} коллекция распаршенных данных
     */
    static fromURL(url) {
        if (url == null) {
            throw new Error('URLData: передан пустой url');
        }

        let urlObject = new URL(url);
        let data = new URLData;

        /* Очищаем path от лиших элементов: */
        let pathElements = urlObject.pathname.split('/');
        pathElements = pathElements.slice(1);
        if (pathElements[pathElements.length - 1] == '') {
            pathElements.pop();
        }
        
        data.url = pathElements[0];
        data.urlParams = pathElements.slice(1);
        data.getParams = Object.fromEntries(urlObject.searchParams);
        
        return data;
    }
}

class Router {
    /**
     * Конструирует роутер.
     */
    constructor() {
        this.root = document.getElementById(constants.elementsID.appRoot);
        if (this.root == null) {
            throw new Error(`Router: не найден корневой элемент с id ${constants.elementsID.appRoot}`);
        }
        this.routes = new Map;
    }

    /**
     * Регистрация URL'a и соответствующего ему контроллера.
     * @param {string} url - url
     * @param {*} controller - контроллер url
     * @returns {Router} Ссылку на this
     */
    registerUrl(url, controller) {
        this.routes[url] = controller;
        return this;
    }

    /**
     * Добавление alias'a на уже зарегестрированный url. (например '/home' для '/').
     * Методом можно воспользоваться, что бы не создавать дополнительный объект контроллера.
     * @param {string} url - ранее
     * @param {string} alias  - alias на url
     * @throws Error, если url не был ранее зарегестрирован.
     * @returns {Router} Ссылку на this
     */
    registerUrlAlias(url, alias) {
        let controller = this.routes.get(url);
        if (controller == null) {
            throw new Error(`Router: ошибка при установке alias'a на ${url}: контроллер не существует.`)
        }
        this.routes[alias] = controller;
        return this;
    }

    /**
     * Обработчик события смены URL'a
     * @param {string} url 
     */
    onURLChanged(url) {
        window.history.pushState(null, '', url);
        let data = URLData.fromURL(url);
        console.log(`onURLChanged: ${url}`);
        console.log(`base url: ${data.url}`);
        console.log(`url params: ${data.urlParams}`);
        console.log(`get params: ${data.getParams}`);
    }

    /**
     * Инициализирует роутер: устанавливает обработчики событий, обрабатывает текущий url.
     */
    route() {
        this.root.addEventListener('click', (event) => {
            const {target} = event;
            if (target instanceof HTMLAnchorElement) {
                event.preventDefault();
                this.onURLChanged(target.href);
            }
        });

        window.addEventListener('popstate', (event) => {
            this.onURLChanged(location.href);
        });

        this.onURLChanged(location.href);
    }
}

export const router = new Router;
