'use strict';

/* Подключение требуемых модулей */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
/* Создаем приложение */
const app = express();
/* Директория со статикой */
const distFolder = path.resolve(__dirname, '..', 'dist');
/* Определяем текущий порт */
const port = process.env.PORT || 80;
/* Цветовая подсветка статусов */
app.use(morgan('dev'));
/* Используем статику */
app.use(express.static(distFolder));
/* Время кэширования ответов, в сек */
const cacheTime = 256 * 24 * 60 * 60;
/* middleware для кэширования бандлов */
const cacheMW = (req, res, next) => {
    if (req.url === 'bundle.js' || req.url === 'style.css') {
        res.set('Cache-control', `public, max-age=${cacheTime}`);
    } else {
        res.set('Cache-control', 'no-store');
    }
    next();
};
app.use(cacheMW);

/* Реагируем на любые запросы посылкой index.html */
app.all('*', (req, res) => {
    res.sendFile(path.resolve(distFolder, 'index.html'));
});

/* Слушаем указаный порт */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
