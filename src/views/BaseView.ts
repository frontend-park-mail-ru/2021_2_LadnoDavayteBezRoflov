// Базовый компонент
import BaseComponent from '../components/BaseComponent';

// Компоненты по умолчанию
import NavbarComponent from '../components/Navbar/Navbar';
import FooterComponent from '../components/Footer/Footer';
import OfflineMessage from '../components/OfflineMessage/OfflineMessage';


/**
 * Класс, реализующий базовый view.
 */
export default class BaseView extends BaseComponent {
    /**
     * Конструирует компонент. Обязательный параметр - функция отрисовки основного шаблона.
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     * @param {Function} template функция отрисовки шаблона
     * @param {Element?} parent элемент, в который будет отрисован шаблон
     */
    constructor(context: any, template: any, parent: any) {
        super(context, template, parent);

        this.addComponent('Navbar', new NavbarComponent(context));
        this.addComponent('Footer', new FooterComponent(context));
        this.addComponent('OfflineMessage', new OfflineMessage(context));

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'BaseV... Remove this comment to see the full error message
        this._isActive = false;
    }

    /**
     * Метод, вызывающийся по умолчанию при открытии страницы.
     */
    _onShow() {
        throw new Error('View: метод _onShow должен быть реализован в подклассе');
    }

    /**
     * Метод, вызывающийся по умолчанию при обновлении страницы.
     */
    _onRefresh() {
        throw new Error('View: метод _onRefresh должен быть реализован в подклассе');
    }

    /**
     * Метод, вызывающийся по умолчанию при закрытии страницы.
     */
    _onHide() {
        this.removeEventListeners();

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isActive' does not exist on type 'BaseV... Remove this comment to see the full error message
        this._isActive = false;
    }
}
