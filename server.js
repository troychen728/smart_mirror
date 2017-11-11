const express = require('express');
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('www'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Smart mirror server listening on port 3000!'))
