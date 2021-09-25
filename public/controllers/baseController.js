/**
 * Интерфейс контроллера. Каждый  контроллер имеет входную точку work().
 */
export class ControllerInterface {
    /**
     * Данный метод реализует логику контроллера (получение данных и отрисовка view).
     * @param {URLData} data данные полученные при обработке URL'a
     */
    work(data) {
        throw new Error('Controller: метод work должен быть реализован в подклассе')
    }
}
