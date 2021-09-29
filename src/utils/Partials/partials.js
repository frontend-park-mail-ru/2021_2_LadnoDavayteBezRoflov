'use strict';

// Скомпилированные шаблоны компонентов Handlebars
import '../../components/Navbar/Navbar.tmpl.js';
import '../../components/Footer/Footer.tmpl.js';

/**
 * Функция, выполняющая регистрацию компонентов для Handlebars.
 */
export const registerPartials = () => {
    Handlebars.registerPartial('NavbarComponent', Handlebars.templates['Navbar.hbs']);
    Handlebars.registerPartial('FooterComponent', Handlebars.templates['Footer.hbs']);
};
