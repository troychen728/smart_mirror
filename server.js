const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('www'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    access_key: fs.readFileSync(path.join(__dirname, "access_key.key")),
    secret_key: fs.readFileSync(path.join(__dirname, "secret_key.key")),
  })
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Smart mirror server listening on port 3000!'))
