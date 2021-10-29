'use strict';

/* Подключение требуемых модулей */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
/* Создаем приложение */
const app = express();
/* Прописываем путь к папке public и */
const publicFolder = path.resolve(__dirname, '..', 'public');
const distFolder = path.resolve(__dirname, '..', 'dist');
/* Определяем текущий порт */
const port = process.env.PORT || 80;
/* Цветовая подсветка статусов */
app.use(morgan('dev'));
/* Используем статику */
app.use(express.static(publicFolder));
app.use(express.static(distFolder));


/* Реагируем на любые запросы посылкой index.html */
app.all('*', (req, res) => {
    res.sendFile(path.resolve(distFolder, 'index.html'));
});

/* Слушаем указаный порт */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
