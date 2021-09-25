/**
 * Интерфейс view.
 */
export class ViewInterface {
    /**
     * Выполняет отрисовку view
     */
    render() {
        throw new Error('ViewInterface: метод render должен быть реализован в подклассе')
    }

}
