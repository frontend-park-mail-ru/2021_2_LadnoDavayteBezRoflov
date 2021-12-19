'use strict';

/* Подключение требуемых модулей */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
/* Создаем приложение */
const app = express();
/* Определяем текущий порт */
const port = process.env.PORT || 80;

/* Цветовая подсветка статусов */
app.use(morgan('dev'));

/* Время кэширования ответов, в сек */
const cacheTime = 256 * 24 * 60 * 60;
/* middleware для кэширования бандлов */
/* const cacheMW = (req, res, next) => {
    res.set('Cache-control', `public, max-age=${cacheTime}`);
    next();
};
app.use([/\/bundle\.[A-Za-z0-9]*\.js/, /\/style\.[A-Za-z0-9]*\.css/], cacheMW); */

/* Директория со статикой */
const distFolder = path.resolve(__dirname, '..', 'dist');
const avatarsFolder = path.resolve(__dirname, '..', 'public');
/* Используем статику */
app.use(express.static(distFolder));
app.use(express.static(avatarsFolder));

/* Реагируем на любые запросы посылкой index.html */
app.all('*', (req, res) => {
    res.sendFile(path.resolve(distFolder, 'index.html'));
});

/* Слушаем указаный порт */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
