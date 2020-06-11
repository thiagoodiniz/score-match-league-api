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

router.post('/divisionPlayers', async (req, res) => {
    try {

        const { leagueId, division, players } = req.body;

        if(!leagueId || !division || !players){
            res.status(400).send({ message: 'É obrigatório passar o ID da Liga, Divisão e os Jogadores'});
            return;
        }

        const leagueConfig = await leagueService.getLeagueConfig(leagueId);

        if(!leagueConfig.length){
            res.status(400).send({ message: `Não foi encontrado Liga com id: ${leagueId}`});
            return;
        }

        let divisionConfig = leagueConfig.find(conf => conf.id == division || conf.name == division);
        const divisionPlayers = await leagueService.getDivisionPlayersCount(divisionConfig.id);
        const divisionPlayersLeft = divisionConfig.number_max_of_players - divisionPlayers.length;

        if(players.length > divisionPlayersLeft ){
            res.status(400).send({ message: `A divisão ${ divisionConfig.name } já tem ${divisionPlayers.length} jogadores. O limite é: ${divisionConfig.number_max_of_players}`});
            return;
        }

        const alreadyAddedPlayers = divisionPlayers.filter(player => players.includes(player.id));
        if( alreadyAddedPlayers.length ){
            res.status(400).send({ 
                message: `Jogador já adicionado. (${alreadyAddedPlayers.map(p => p.id).join(',')})`});
            return;
        }

        await leagueService.saveDivisionPlayers(divisionConfig.leagueDivisionId, players);

        res.send({ message: 'Jogadores adicionados com sucesso', playersLeft: divisionPlayersLeft - players.length });

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Erro inesperado.` });
    }
});


module.exports = app => app.use('/league', router);
