'use strict';

import BaseComponent from '../baseComponent.js'

import './navbar.tmpl.js';

// TODO jsdoc
export default class NavbarComponent extends BaseComponent {
    
    constructor(parent, state) {
        super(parent, state);
        this.renderComponent = Handlebars.templates['navbar.hbs'];
    }

    renderPartial() {
        return this.renderComponent(this.state);
    }
}
