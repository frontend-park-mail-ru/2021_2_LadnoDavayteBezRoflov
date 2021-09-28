'use strict';

import { Urls, Html } from '../constants.js';
import NotFoundController from '../../controllers/NotFound/NotFoundController.js';
import ControllerInterface from '../../controllers/BaseController.js';

class URLData {
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
    if (url === null) {
      throw new Error('URLData: передан пустой url');
    }

    const urlObject = new URL(url, origin);

    const data = new URLData();

    /* Очищаем path от лишних элементов: */
    const pathElements = urlObject.pathname.replace(/(\/)*/g, '').split('/');
    data.url = `/${pathElements[0]}`;
    data.urlParams = pathElements.slice(1);
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

    if (this.root === null) {
      throw new Error(`Router: не найден корневой элемент с id ${Html.Root}`);
    }

    this.routes = new Map();
    this.registerNotFound();
  }

  /**
     * Регистрация URL'a и соответствующего ему контроллера.
     * @param {string} url - url
     * @param {ControllerInterface} controller - контроллер url
     * @returns {Router} cсылку на this
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
     * Добавление alias'a на уже зарегестрированный url. (например '/home' для '/').
     * Методом можно воспользоваться, что бы не создавать дополнительный объект контроллера.
     * @param {string} url - ранее
     * @param {string} alias  - alias на url
     * @throws Error, если url не был ранее зарегестрирован.
     * @returns {Router} cсылку на this
     */
  registerUrlAlias(url, alias) {
    const controller = this.routes.get(url);
    if (controller === null) {
      throw new Error(`Router: ошибка при установке alias'a на "${url}": контроллер не существует.`);
    }
    this.routes.set(alias, controller);
    return this;
  }

  /**
     * Инициализирует роутер: устанавливает обработчики событий, обрабатывает текущий url.
     */
  route() {
    this.root.addEventListener('click', (event) => {
      const { target } = event;
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

    const data = URLData.fromURL(url);
    const controller = this.routes.get(data.url);

    if (controller === null) {
      console.error(`Router: не найден контроллер для url'a <${data.url}>`);
      this.toUrl(Urls.NotFound);
      return;
    }

    controller.work(data);
  }

  /**
     * Возврат на предыдущий URL в истории
     * TODO - починить
     */
  toPrev() {
    window.history.back();
  }

  /**
     * Переход на следующий URL в истории
     * TODO - починить
     */
  toNext() {
    window.history.forward();
  }

  /**
     * Регистрирует контроллер по умолчанию
     */
  registerNotFound() {
    this.registerUrl(Urls.NotFound, new NotFoundController());
  }
}

export default new Router();
