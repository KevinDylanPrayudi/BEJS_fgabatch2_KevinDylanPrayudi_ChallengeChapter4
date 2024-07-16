const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const router = require('./routes');
const db = require('./db');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router(express.Router(), db));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})