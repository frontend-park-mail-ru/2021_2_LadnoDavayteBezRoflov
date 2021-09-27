'use strict';

/* Подключение требуемых модулей */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Handlebars = require('handlebars');
/* Создаем приложение */
const app = express();
/* Прописываем путь к папке public */
const publicFolder = path.resolve(__dirname, '..', 'public');
const srcFolder = path.resolve(__dirname, '..', 'src');
/* Определяем текущий порт */
const port = process.env.PORT || 3000;
/* Цветовая подсветка статусов */
app.use(morgan('dev'));
/* Используем статику*/
app.use(express.static(publicFolder));
app.use(express.static(srcFolder));

/* фикс выдачи скриптов */
app.all('/src/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..' + req.url));
});

/* фикс выдачи скриптов */
app.all('/public/css/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..' + req.url));
});

/* Реагируем на любые запросы посылкой index.html */
app.all('*', (req, res) => {
  res.sendFile(path.resolve(publicFolder + '/index.html'));
});

/* Слушаем указаный порт */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
