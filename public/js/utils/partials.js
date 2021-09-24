'use strict';

import '../components/navbar/navbar.tmpl.js';

export const registerPartials = () => {
    Handlebars.registerPartial('NavbarComponent', Handlebars.templates['navbar.hbs']);
}
