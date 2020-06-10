var knex = require('../database');

const service = {
    getDivisions: () => {
        return knex('tb_division_type')
         .then(dados => dados)
         .catch(err => console.log(err));
    }
}

module.exports = service;