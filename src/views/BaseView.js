// Базовый компонент
import BaseComponent from '../components/BaseComponent.js';

// Компоненты по умолчанию
import NavbarComponent from '../../components/Navbar/Navbar.js';
import FooterComponent from '../../components/Footer/Footer.js';

/**
 * Класс, реализующий базовый view.
 */
export default class BaseView extends BaseComponent {
    /**
    * @constructor
    * @param {Object} context контекст отрисовки шаблона
    * @param {function} template функция-шаблон
    * @param {Element} parent HTML-элемент, в который
    * будет осуществлена отрисовка
    */
    constructor(context, template, parent) {
        super(context, template, parent);

        if (!!this.template) {
            this.subComponents = [];

            this.subComponents.push(['Navbar', new NavbarComponent(context)]);
            this.subComponents.push(['Footer', new FooterComponent(context)]);
        }

        this._isActive = false;
    }

    /**
     * Метод, обновляющий контекст у самой страницы и у всех ее субкомпонентов.
     * @param {Object} context
     */
    _setContext(context) {
        this.context = context;

        this.subComponents.forEach(([_, component]) => {
            component.context = this.context;
        });
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

        this.subComponents.forEach(([_, component]) => {
            component.removeEventListeners();
        });

        this._isActive = false;
    }

    /**
    * Метод, отрисовывающий страницу по заданному шаблону
    */
    render() {
        const components = this.subComponents.reduce(function(accumulator, object) {
            return {...accumulator, ...{[object[0]]: object[1].render()}};
        }, {});

        this.parent.innerHTML = this.template({...components, ...Object.fromEntries(this.context)});
    }

    /**
     * Метод, добавляющий новый компонент.
     * @param {String} name имя компонента
     * @param {Object} component компонент
     */
    addComponent(name, component) {
        if (typeof this.subComponents !== 'undefined') {
            this.subComponents.push([name, component]);
        }
    }
}
