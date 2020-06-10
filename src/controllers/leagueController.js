const express = require('express');

const router = express.Router();

const leagueService = require('../services/leagueService');

router.get('/', async (req, res) => {
    try {
        const leagueBoard = await leagueService.getLastLeagueBoard();

        if(!leagueBoard){
            res.status(404).send({ message: 'Não há nenhuma liga criada.' })
            return;
        }

        res.send(leagueBoard);
    } catch(err){
        console.log(err);
        res.status(500).send({ message: `Não foi possível obter a liga` });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        const activeLeagues = await leagueService.getActiveLeague();

        if(activeLeagues.length > 0){
            res.status(400).send({ message: `A liga '${ activeLeagues[ activeLeagues.length - 1 ].name }' ainda está ativa`})
            return;
        }

        const leagueId = await leagueService.createLeague(name);

        res.send({ message: 'Liga criada com sucesso.', leagueId });
    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Não foi possível criar a liga` });
    }
});


module.exports = app => app.use('/league', router);