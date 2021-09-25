import Controller from './controller.js';
import { constants } from "./constants.js";

/* Задача роутера: следить за именением ссылки и вызывать тот или иной метод контроллера */

class Router {
    /**
     * Инициализует роутер.
     */
    constructor() {
        this.root = document.getElementById(constants.elementsID.appRoot);
        if (!root) {
            throw new Error(`Router: не найден корневой элемент с id ${constants.elementsID.appRoot}`);
        }
        this.routes = new Map;
    }

    /**
     * Регистрация URL'a и соответствующего ему контроллера.
     * 
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
        controller = this.routes.get(url);
        if (!controller) {
            throw new Error(`Router: ошибка при установке alias'a на ${url}: контроллер не существует.`)
        }
        this.routes[alias] = controller;
        return this;
    }

}

export const router = new Router;
