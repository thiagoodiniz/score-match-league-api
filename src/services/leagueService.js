
var knex = require('../database');

const genericService = require('./index');

const leagueService = {

    getActiveLeague: () => {
        return knex('tb_league')
            .where('status', '=', 1)
            .then(data => data);
    },

    getLastLeagueDivisions: async () => {
        return knex('tb_league')
            .orderBy('register_date', 'desc')
            .limit('1')
            .then(data => {
                if(data.length > 0){
                    const league = data[0];
                    return knex('tb_league_division AS a')
                        .join('tb_division_type AS b', 'a.id_division_type', '=', 'b.id')
                        .select('a.id AS idLeagueDivision', 'b.name AS division', 'b.number_max_of_players AS numberOfPlayers')
                        .where('a.id_league', '=', league.id)
                        .then( data => {
                            return {
                                ...league,
                                divisions: data,
                            }
                        });
                }
            });
    },

    getDivisionPlayers: (leagueDivisionId) => {
        return knex('tb_league_division_players AS a')
            .join('tb_player AS b', 'b.id', '=', 'a.id_player')
            .select('a.id_player AS id', 'a.id AS idLeagueDivisionPlayer', 'b.name', 'b.uf')
            .where('id_league_division', '=', leagueDivisionId)
            .then(data => data)
    },

    // Cria a Liga e as divisões
    createLeague: async (name) => {
        const divisions = await genericService.getDivisions();
        return knex('tb_league')
            .insert({name, status: 1})
            .then(res => {
                const leagueId = res[0];
                const divisionRows = divisions.map(division => {
                    return {
                        id_league: leagueId, 
                        id_division_type: division.id,
                    }
                });
                return knex.batchInsert('tb_league_division', divisionRows)
                .then(res => leagueId);
            });
    },

    getLeagueConfig: (leagueId) => {
        return knex('tb_league_division AS a')
            .join('tb_division_type AS b', 'a.id_division_type', '=', 'b.id')
            .select('b.*', 'a.id AS leagueDivisionId')
            .where('a.id_league', '=', leagueId)
            .then(data => data);
    },

    getDivisionPlayersCount: (leagueDivisionId) => {
        return knex('tb_league_division_players')
            .where('id_league_division', '=', leagueDivisionId)
            .then(data => data)
    },

    saveDivisionPlayers: (leagueDivisionId, players) => {
        const divisionPlayerRows = players.map(playerId => {
            return {
                id_player: playerId,
                id_league_division: leagueDivisionId,
            }
        });

        return knex.batchInsert('tb_league_division_players', divisionPlayerRows);            
    },

    createMatches: (leagueDivisionId, rounds) => {
        const matchRows = []; 
        rounds.map(round => {
            return round.map(match => {
                matchRows.push({
                    id_league_division: leagueDivisionId,
                    round: match.round,
                    id_league_division_player1: match.idLeagueDivisionPlayer1,
                    id_league_division_player2: match.idLeagueDivisionPlayer2,
                    status: 4,
                });
            });
        });

        return knex.batchInsert('tb_league_division_matches', matchRows);
    },

    getDivisionMatches: (leagueDivisionId, leagueDivisionMatchId) => {
        const query = knex('tb_league_division_matches AS a')
            .join('tb_league_division_players AS player1', 'a.id_league_division_player1', '=', 'player1.id')
            .join('tb_league_division_players AS player2', 'a.id_league_division_player2', '=', 'player2.id')
            .select('a.*', 'player1.id_player AS idPlayer1', 'player2.id_player AS idPlayer2');

        if(leagueDivisionMatchId){
            query.where('a.id', '=', leagueDivisionMatchId)
        } else {
            query.where('a.id_league_division', '=', leagueDivisionId)
        }

        return query.then(data => data);
    },

    updateDivisionMatches: matches => {
        const queries = [];
        
        matches.map(match => {
            queries.push(
                knex('tb_league_division_matches')
                .where('id', '=', match.idLeagueDivisionMatch)
                .update({
                    scored_goals_player1: match.player1.scoredGoals,
                    scored_goals_player2: match.player2.scoredGoals,
                    last_update_date: new Date(),
                    status: match.player1.scoredGoals && match.player2.scoredGoals 
                        ? 2 // ENCERRADO 
                        : 4 // PENDENTE
                })
            );
        });

        return Promise.all(queries)
            .then(res => res)
    },

}

module.exports = leagueService;