const express = require('express')
const app = express()
const app_port = 3000

app.use(express.static('public'));

app.listen(app_port)
