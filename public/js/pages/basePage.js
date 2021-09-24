'use strict';

// TODO jsdoc
export default class BasePage {
    
    constructor(parent, template) {
        this.parent = parent;
        this.template = template;
    }

    render(data) {
        this.parent.innerHTML = this.template(data);
    }
}
