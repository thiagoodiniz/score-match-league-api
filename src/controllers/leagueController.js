const express = require('express');

const router = express.Router();

var knex = require('../database');


router.get('/', async (req, res) => {
    knex('tb_league')
    .then(dados => res.send(dados))
    .catch(err => console.log(err));
});



module.exports = app => app.use('/league', router);