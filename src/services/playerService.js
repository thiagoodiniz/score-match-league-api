var knex = require('../database');

const playerService = {
    getPlayers: (playerId) => {
        const query = knex('tb_player');
        if(playerId){
            query.where('id', '=', playerId);
        }
        return query.then(data => data)
    },

    savePlayer: (name, uf) => {
        return knex('tb_player')
        .insert({name, uf, status: 1})
        .then(res => res[0]);
    },

    updatePlayer: (idPlayer, name, uf, status) => {
        return knex('tb_player')
        .where('id', '=', idPlayer)
        .update({
            name,
            uf,
            status,
        });
    }
}

module.exports = playerService;