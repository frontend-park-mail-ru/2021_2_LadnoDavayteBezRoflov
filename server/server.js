'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Handlebars = require('handlebars');
const app = express();

const publicFolder = path.resolve(__dirname, '..', 'public');

const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(express.static(publicFolder));

app.all('/', (req, res) => {
  res.sendFile(path.resolve(publicFolder + '/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
