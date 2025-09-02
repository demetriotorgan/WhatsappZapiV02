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

//Get para baixar as mensagens recebidas
router.get('/webhook-mensagens', async(req,res)=>{
   try {
    //Busca mensagens no banco de dados
    const mensagens = await MensagemRecebida.find().sort({receivedAt: -1});

    //Lista de telefones salvos:
    const telefones = [];
    mensagens.forEach(msg=>{
        try {
            const payload = JSON.parse(msg.rawPayload);
            if(payload.phone){
                telefones.push(payload.phone);
            }
        } catch (err) {
            console.error('Erro ao parsear rawPayload: ', err.message);
        }
    });

    //Remover Telefones duplicados
    const telefonesUnicos = [...new Set(telefones)];

    res.status(200).json({
        sucesso:true,        
        totalMensagens:mensagens.length,
        totalTelefones: telefonesUnicos.length,
        telefonesUnicos        
    }); 
   } catch (err) {
    console.error('Erro ao buscar mensagens recebidas', err);
    res.status(500).json({
        sucesso:false,
        erro:'Erro interno no servidor'
    });
   }
});