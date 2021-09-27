#!/usr/bin/env bash
handlebars src/components/Navbar/Navbar.hbs -f src/components/Navbar/Navbar.tmpl.js &&
handlebars src/components/Footer/Footer.hbs -f src/components/Footer/Footer.tmpl.js &&
handlebars src/pages/RegisterPage/RegisterPage.hbs -f src/pages/RegisterPage/RegisterPage.tmpl.js &&
handlebars src/pages/LoginPage/LoginPage.hbs -f src/pages/LoginPage/LoginPage.tmpl.js &&
handlebars src/pages/BoardsPage/BoardsPage.hbs -f src/pages/BoardsPage/BoardsPage.tmpl.js
