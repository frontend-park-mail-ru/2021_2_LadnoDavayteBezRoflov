# Trello

Trello frontend repository for Ladno Davayte Bez Roflov team, autumn of 2021.

### Team

* [Anton Chumakov](https://github.com/TonyBlock);
* [Alexander Orletskiy](https://github.com/Trollbump);
* [Georgij Sedojkin](https://github.com/GeorgiyX);
* [Dmitrij Peshkov](https://github.com/DPeshkoff).

### Mentors

* [Ekaterina Alekseeva](https://github.com/yletamitlu) — frontend mentor;
* [Gavrilenco Roman](https://github.com/gavroman) — frontend mentor;
* [Timofej Razumov](https://github.com/TimRazumov) — backend mentor.

### Backend repository
[Link to backend repository](https://github.com/go-park-mail-ru/2021_2_LadnoDavayteBezRoflov).

### API
[Link to API](https://app.swaggerhub.com/apis/DPeshkoff/LadnoDavayteBezRoflov).

### Deploy
[Link to deploy](http://95.163.213.142).

### Usage

> Starting the server from the scratch: `npm start`

> Compiling Handlebars templates: `npm run handlebars`

> Running server without template compilation: `npm run server`

> Running linter: `npm run lint`

> Running linter in fixing mode: `npm run lint:fix`

### Directory structure

```bash
2021_2_LadnoDavayteBezRoflov
|--.github/workflows #GitHub Actions CI
|
|--public
|  |--assets #Pictures and icons
|  |--css #CSS files
|  |--fonts #Font files
|  |-index.html
|
|--server #Static-server
|  |-server.js
|
|--src #JS sources
|  |--actions #Actions and action types
|  |--components #Components
|  |--constants #Global constants
|  |--modules #Modules
|  |  |--Dispatcher
|  |  |--EventBus 
|  |  |--Network
|  |  |--Router
|  |  |--Validator
|  |
|  |--stores #Stores & main logic
|  |--views #Project pages
|  |-index.js
|
|-.eslintignore
|
|-.eslintrc.json
|
|-LICENSE
|
|-.gitignore
|
|-package-lock.json
|
|-package.json
|
|-README.md
```

### Versions

Versions are updated via two ways:

1. **Major updates**: major changes to server, architecture and modules. Example: *transferring to Flux architecture*;

2. **Minor updates**: minor fixes and changes to server and modules. Example: *refactoring Network module*.

Latest version: `0.2.0`: *Transferred to Flux architecture, refactored every module*.

### Code style
The project is written using slightly modified [Google ESling config](https://github.com/google/eslint-config-google). Code style changes:
  
* **Semicolons** at the end of statements are **required**;
* Use of **single quotes** wherever possible is **required**;
* **4-space** indentation is **required**;
* **Mixed tabs and spaces** when the spaces are used for alignment are **allowed**;
* **All imports** from a single module **must be** in a single import statement;
* **Not** enforcing **line endings** like `\n` or `\r\n` is **required**;
* `let` or `const` instead of `var` is **required**;
* **Variable redeclaration** is **disallowed**;
* **Throw warning** if there are **unused** variables;
* **Maximum code string length** is **105**;
* **Irregular whitespaces** are **allowed**.
