// Базовый компонент
import BaseComponent from '../BaseComponent';
// Стили
import './Footer.scss';
// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './Footer.hbs' or its correspon... Remove this comment to see the full error message
import template from './Footer.hbs';

/**
 * Класс, реализующий компонент Footer.
 */
export default class FooterComponent extends BaseComponent {
    /**
    * Конструктор, создающий класс компонента Footer.
    * @param {Object} context контекст отрисовки шаблона
    */
    constructor(context: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(context, template);
    }
}
