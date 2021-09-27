'use strict';

/**
 * Интерфейс контроллера. Каждый контроллер имеет входную точку work().
 */
export default class ControllerInterface {
    /**
     * Данный метод должен реализовывать логику контроллера (получение данных и отрисовка view) в подклассе.
     * @param {URLData} data данные полученные при обработке URL'a
     */
    work(data) {
        throw new Error('Controller: метод work должен быть реализован в подклассе');
    }
}
