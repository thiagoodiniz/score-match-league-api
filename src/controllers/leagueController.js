const express = require('express');

const router = express.Router();

const leagueService = require('../services/leagueService');
const leagueDivisionHelper = require('../helpers/leagueDivisionHelper');

router.get('/', async (req, res) => {
    try {
        const leagueDivisions = await leagueService.getLastLeagueDivisions();
        
        if(!leagueDivisions){
            res.status(404).send({ message: 'Não há nenhuma liga criada.' });
            return;
        }
        
        const divisionPlayerPromisses = leagueDivisions.divisions.map(async division => {
            const players = await leagueService.getDivisionPlayers(division.idLeagueDivision);

            const divisionMatches = await leagueService.getDivisionMatches(division.idLeagueDivision);

            players.map(player => {
                const playerDivisionMatches = divisionMatches.filter(divisionMatch => 
                    divisionMatch.idPlayer1 == player.id || divisionMatch.idPlayer2 == player.id );

                player.stats = leagueDivisionHelper.getPlayerDivisionStats(player, playerDivisionMatches); 
            });

            return {
                ...division,
                divisionMatches,
                players: leagueDivisionHelper.sortStandings(players),
            };
        });
        
        leagueDivisions.divisions = await Promise.all(divisionPlayerPromisses);
        
        res.send(leagueDivisions);
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
            res.status(400).send({ message: `A liga '${ activeLeagues[ activeLeagues.length - 1 ].name }' ainda está ativa`});
            return;
        }

        const leagueId = await leagueService.createLeague(name);

        res.send({ message: 'Liga criada com sucesso.', leagueId });
    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Não foi possível criar a liga` });
    }
});

// Jogadores para as divisões
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
            res.status(400).send({ 
                message: `Limite ultrapassado. Restam ${divisionPlayersLeft} vagas na divisão ${divisionConfig.name}.` // s2
            });
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

router.post('/divisionMatches', async (req, res) => {
    try {
        const { leagueId, leagueDivision, rounds } = req.body;

        if(!leagueId || !leagueDivision || !rounds){
            res.status(400).send({ message: 'É necessário passar os campos: leagueId, leagueDivision e rounds'});
            return;
        }

        const leagueConfig = await leagueService.getLeagueConfig(leagueId);
        if(!leagueConfig.length){
            res.status(400).send({ message: `Não foi encontrado Liga com id: ${leagueId}`});
            return;
        }
        const divisionConfig = leagueConfig.find(conf => conf.id == leagueDivision || conf.name == leagueDivision);

        if( rounds.length != divisionConfig.number_max_of_players -1 ){
            res.status(400).send({
                message: `A divisão ${ divisionConfig.name } precisa ter ${ divisionConfig.number_max_of_players -1 } rodadas.`
            });
        }

        if(rounds.some(round => round.length != divisionConfig.number_max_of_players / 2)){
            res.status(400).send({
                message: `Cada rodada da divisão ${ divisionConfig.name } precisa ter ${ divisionConfig.number_max_of_players / 2 } partidas.`
            });
        }

        await leagueService.createMatches(divisionConfig.id, rounds);

        res.send({ message: 'Partidas registradas com sucesso.' });

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Erro inesperado.` });
    }
});

router.get('/divisionMatches/:id?', async (req,res) => {
    try{
        const leagueDivisionMatchId = req.params.id;
        const { leagueDivisionId } = req.body;

        if(!leagueDivisionId){
            res.status(400).send({ message: 'É necessário passar o campo: leagueDivisionId'});
            return;
        }

        const leagueDivisionMatches = await leagueService.getDivisionMatches(leagueDivisionId, leagueDivisionMatchId);
        const leagueDivisionPlayers = await leagueService.getDivisionPlayers(leagueDivisionId);

        const matches = leagueDivisionMatches.map(match => {
            return {
                idLeagueDivisionMatch: match.id,
                idLeagueDivision: match.id_league_division,
                round: match.round,
                player1: {
                    ...leagueDivisionPlayers.find(player => player.id === match.idPlayer1),
                    scoredGoals: match.scored_goals_player1,
                },
                player2: {
                    ...leagueDivisionPlayers.find(player => player.id === match.idPlayer2),
                    scoredGoals: match.scored_goals_player2,
                },
                lastUpdateDate: match.last_update_date,
                status: match.status
            }
        });

        res.send(matches);

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Erro inesperado.` });
    }
});

router.put('/divisionMatches', async (req,res) => {
    try{
        const { matches } = req.body;

        if(!matches || matches.length < 1){
            res.status(400).send({ message: 'É necessário passar os campos: matches'});
            return;
        }

        await leagueService.updateDivisionMatches(matches);

        res.send({ message: 'Placares atualizados com sucesso.' })

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: `Erro inesperado.` });
    }
});


module.exports = app => app.use('/league', router);
