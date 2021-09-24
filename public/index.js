'use strict';

import RegisterPage from './js/pages/register/register.js'

import {registerPartials} from './js/utils/partials.js'


window.addEventListener('DOMContentLoaded', async () => {
    const body = document.getElementById('page');

    registerPartials();

    const Register = new RegisterPage(body);

    const context = {
        isAuthorized: true,
        userid: 5,
    }

    Register.render(context);
});

