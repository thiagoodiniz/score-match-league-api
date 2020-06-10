const express = require('express');

const router = express.Router();

const playerService = require('../services/playerService');

router.get('/', async (req, res) => {
    try {
        const players = await playerService.getPlayers();
        res.send(players);
    } catch(err){
        console.log(err);
        res.status(500).send({ message: 'Não foi possível obter a lista de jogadores'});
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, uf } = req.body;

        if(!name || !uf){
            res.status(400).send({ message: 'Os campos Nome e UF são obrigatórios'});
            return;
        } 

        const playerId = await playerService.savePlayer(name, uf);
        res.send({message: `O Jogador ${name} foi criado. ID: ${playerId}`});

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: 'Não foi possível adicionar o jogador'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const playerId = req.params.id;
        const { name, uf, status } = req.body;

        if(!name || !uf){
            res.status(400).send({ message: 'Os campos Nome e UF são obrigatórios'});
            return;
        }

        await playerService.updatePlayer(playerId, name, uf, status);
        res.send({message: `O Jogador foi atualizado.`});

    } catch(err) {
        console.log(err);
        res.status(500).send({ message: 'Não foi possível atualizar o jogador'});
    }

});


module.exports = app => app.use('/player', router);