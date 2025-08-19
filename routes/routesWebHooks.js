const express = require('express');
const MensagemRecebida = require('../models/MensagemRecebida');

require('dotenv').config();

const router = express.Router();

//WebHook para receber mensagens
router.post('/webhook', async(req,res)=>{
    
    try {
        console.log('Webhook recebido:', JSON.stringify(req.body, null, 2));

    //salvando no mongodb
    await MensagemRecebida.create({
        rawPayload: JSON.stringify(req.body),
        receivedAt: new Date()
    });
        res.sendStatus(200);
    } catch (err) {
        console.error('Erro ao salvar mensagem recebida', err);
        res.status(500).json({sucesso:false, erro:'Erro interno ao servidor'});
    }    
});

module.exports = router;