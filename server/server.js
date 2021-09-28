'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/welcome.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
