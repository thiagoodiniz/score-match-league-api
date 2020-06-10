const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./controllers/leagueController')(app);
require('./controllers/playerController')(app);

const port = 3000;

app.listen(port);
console.log(`API escutando na porta ${port}`);
