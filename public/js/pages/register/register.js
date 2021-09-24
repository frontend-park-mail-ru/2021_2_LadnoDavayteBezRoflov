'use strict';

import BasePage from '../basePage.js'
import NavbarComponent from '../../components/navbar/navbar.js'

import './register.tmpl.js';

// TODO jsdoc
export default class RegisterPage extends BasePage {

  constructor(parent) {
    super(parent, Handlebars.templates['register.hbs']);
  }

  render(context) {
    super.render(context);

    // create navbar
    this.navbarComponent = new NavbarComponent(document.getElementById('header-main'), context);
    this.navbarComponent.render();

    this.addEventListeners();
  }

  addEventListeners() {
    document.getElementById('register').addEventListener('submit', this.formRegistration, this);
  }

  removeEventListeners() {
    document.getElementById('register').removeEventListeners();
  }

  formRegistration(event) {
    event.preventDefault(); // prevent from page updating
    console.log('it works'); // placeholder
  }

}
