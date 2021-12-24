// Базовый компонент
import BaseComponent from '../BaseComponent';

// Шаблон
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './Card.hbs' or its correspondi... Remove this comment to see the full error message
import template from './Card.hbs';

// Стили
import './Card.scss';

/**
 * Класс, реализующий компонент Card.
 */
export default class CardComponent extends BaseComponent {
    /**
     * @constructor
     * @param {Object} context контекст отрисовки шаблона
     */
    constructor(context: any) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        super(context, template);
    }
}
