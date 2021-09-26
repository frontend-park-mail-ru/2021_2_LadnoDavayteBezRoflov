#!/usr/bin/env bash
handlebars src/components/navbar/navbar.hbs -f src/components/navbar/navbar.tmpl.js &&
handlebars src/components/footer/footer.hbs -f src/components/footer/footer.tmpl.js &&
handlebars src/pages/register/register.hbs -f src/pages/register/register.tmpl.js &&
handlebars src/pages/login/login.hbs -f src/pages/login/login.tmpl.js &&
handlebars src/pages/boards/boards.hbs -f src/pages/boards/boards.tmpl.js
