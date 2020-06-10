
var knex = require('../database');

const genericService = require('./index');

const leagueService = {

    getActiveLeague: () => {
        return knex('tb_league')
            .where('status', '=', 1)
            .then(data => data)
    },

    getLastLeagueBoard: () => {
        return knex('tb_league')
            .orderBy('register_date', 'desc')
            .limit('1')
            .then(data => {
                if(data.length > 0){
                    const league = data[0];
                    return knex('tb_league_division')
                        .join('tb_division_type', 'tb_league_division.id_division_type', '=', 'tb_division_type.id')
                        .select('tb_league_division.id', 'tb_division_type.name as division')
                        .where('tb_league_division.id_league', '=', league.id)
                        .then(data => {
                            return {
                                ...league,
                                divisions: data,
                            }
                        });
                }
            })
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
                .then(res => leagueId)        
            });
    }
}

module.exports = leagueService;