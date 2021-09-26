'use strict';

// Скомпилированные шаблоны компонентов Handlebars
import '../../components/navbar/navbar.tmpl.js';
import '../../components/footer/footer.tmpl.js';

/**
 * Функция, выполняющая регистрацию компонентов для Handlebars.
 */
export const registerPartials = () => {
    Handlebars.registerPartial('NavbarComponent', Handlebars.templates['navbar.hbs']);
    Handlebars.registerPartial('FooterComponent', Handlebars.templates['footer.hbs']);
}
