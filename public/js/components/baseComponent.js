'use strict';

// TODO jsdoc
export default class BaseComponent {

    constructor(parent, state) {
        this.parent = parent;
        this.state = state;
    }

    render() {
        this.parent.insertAdjacentHTML('beforebegin', this.renderPartial());
    }
}
