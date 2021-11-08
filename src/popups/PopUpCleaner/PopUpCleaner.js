import BoardStore from '../../stores/BoardStore/BoardStore';
import BoardsStore from '../../stores/BoardsStore/BoardsStore';

/**
 * Используется для очистки div'ов для popup. Т.к. если на один стор подписано несколько
 * popup'ов, то стор гарантирует что отображаться должен только один. Остальные же - рисую null
 * в parent'a и таким образом могут затереть текущий, уже отренереный popup (зависит от порядка подписки)
 * Если же не выполнять рендер, когда visible флаг в контектсте false, то тогда не сможет очиститься div,
 * в случае если popup закрывается.
 */
export default class PopUpCleaner {
    /**
     * Конструирует PopUpCleaner
     * @param {Element} parent Контейнер в который отрисовываются popup'ы
     */
    constructor(parent) {
        this._parent = parent;
        this._clearParent = this._clearParent.bind(this);
        BoardStore.addListener(this._clearParent);
        BoardsStore.addListener(this._clearParent);
    }

    /**
     * Очищает родительский контейнер
     * @private
     */
    _clearParent() {
        this._parent.innerHTML = null;
    }
}
