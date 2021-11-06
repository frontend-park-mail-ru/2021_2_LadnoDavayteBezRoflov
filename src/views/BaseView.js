// Базовый компонент
import BaseComponent from '../components/BaseComponent.js';

// Компоненты по умолчанию
import NavbarComponent from '../components/Navbar/Navbar.js';
import FooterComponent from '../components/Footer/Footer.js';


/**
 * Класс, реализующий базовый view.
 */
export default class BaseView extends BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     * @param {Object} mainTemplate объект с функцией шаблона и контейнером для него
     * @param {Function} mainTemplate.template функция отрисовки шаблона
     * @param {Element?} mainTemplate.parent элемент, в который будет отрисован шаблон
     * @param {Object} popupTemplate Объект с функцией шаблона popup и контейнером для него
     * @param {Function} popupTemplate.template функция отрисовки шаблона popup
     * @param {Element?} popupTemplate.parent элемент, в который будет отрисован шаблон popup
    */
    constructor(context, mainTemplate, popupTemplate) {
        super(context, mainTemplate, popupTemplate);

        this.addComponent('Navbar', new NavbarComponent(context));
        this.addComponent('Footer', new FooterComponent(context));

        this._isActive = false;
    }

    /**
     * Метод, обновляющий контекст у самой страницы и у всех ее субкомпонентов.
     * @param {Object} context
     */
    _setContext(context) {
        this.context = context;

        super._setContext(context);
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
        super.removeEventListeners();
        this.removeEventListeners();

        this._isActive = false;
    }
}
