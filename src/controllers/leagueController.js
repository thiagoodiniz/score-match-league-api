const express = require('express');

const router = express.Router();

const service = require('../services');

router.get('/', async (req, res) => {
    const divisionTypes = await service.getDivisions();

    res.send(divisionTypes);
    console.log(divisionTypes);
});


module.exports = app => app.use('/league', router);