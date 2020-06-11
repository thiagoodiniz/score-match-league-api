
var knex = require('../database');

const genericService = require('./index');

const leagueService = {

    getActiveLeague: () => {
        return knex('tb_league')
            .where('status', '=', 1)
            .then(data => data);
    },

    getLastLeagueBoard: () => {
        return knex('tb_league')
            .orderBy('register_date', 'desc')
            .limit('1')
            .then(data => {
                if(data.length > 0){
                    const league = data[0];
                    return knex('tb_league_division AS a')
                        .join('tb_division_type AS b', 'a.id_division_type', '=', 'b.id')
                        .select('a.id', 'b.name as division')
                        .where('a.id_league', '=', league.id)
                        .then(data => {
                            return {
                                ...league,
                                divisions: data,
                            }
                        });
                }
            });
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
    }
}

module.exports = leagueService;