
var knex = require('../database');

const genericService = require('./index');

const leagueService = {

    getActiveLeague: () => {
        return knex('tb_league')
            .where('status', '=', 1)
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
                .then(res => leagueId)        
            });
    }
}

module.exports = leagueService;