const express = require('express');
const cors = require('cors');
const app = express();         
const bodyParser = require('body-parser');
const swaggerDoc = require('./swagerDoc.js');

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


require('./controllers/leagueController')(app);
require('./controllers/playerController')(app);
swaggerDoc(app);

const port = 3001;

app.listen(port);
console.log(`API escutando na porta ${port}`);
