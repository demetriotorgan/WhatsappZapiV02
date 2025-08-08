const express = require('express');
const axios = require('axios');
const Mensagem = require('../models/Mensagem');
const MensagemRecebida = require('../models/MensagemRecebida');
require('dotenv').config();

const router = express.Router();

router.post('/enviar', async(req,res)=>{
    const {phone, message} = req.body;
    if(!phone || !message){
        return res.status(400).json({sucesso:false, erro:'Telefone e mensagem são obrigatórios'});        
    }
    try {
        const response = await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,{
                    phone:phone,
                    message:message,
                },
                {
                    headers:{
                         'Client-Token': process.env.ZAPI_CLIENT_TOKEN
                    }
                });
                //Salva no MongoDB
                console.log('Resposta da Z-API:', response.data);
                //Salva no MongoDB
                await Mensagem.create({phone,message});
                res.status(200).json({sucesso:true, mensagem:'Mensagem enviada com sucesso!'});
    } catch (error) {
        if(error.response){
            console.error('Erro da Z-API:', error.response.data);
        }else{
            console.error('Erro desconhecido:', error.message);
        }        
        res.status(500).json({sucesso:false, error:'Erro ao enviar mensagem'});
    }
});

router.get('/mensagens', async(req,res)=>{
    try {
        const mensagens = await Mensagem.find().sort({_id:-1});
        res.status(200).json(mensagens);
    } catch (err) {
        console.error('Erro ao carregar mensagens', err);
        res.status(500).json({sucesso:false, erro:'Erro ao buscar mensagens'})
    }
});

//-----------WebHook---------------
router.post('/webhook', async(req,res)=>{
    console.log('Webhook recebido:', JSON.stringify(req.body, null, 2));
    try {
        const {phone, text, senderName, chatName} = req.body
        if (!phone || !text?.message) {
        return res.status(400).json({ sucesso: false, erro: 'Dados incompletos' });
    }
    //salvando no mongodb
    await MensagemRecebida.create({
        phone,
        senderName,
        chatName,
        message: text.message,
    });
        res.sendStatus(200);
    } catch (err) {
        console.error('Erro ao salvar mensagem recebida', err);
        res.status(500).json({sucesso:false, erro:'Erro interno ao servidor'});
    }    
});

module.exports = router;

//verifica se veio uma mensagem
    // constbody = req.body;
    // if(body.message && body.message.text && body.message.text.body){
    //     const from = body.message.from;
    //     const message = body.message.text.body;

    //     //salva no mongodb
    //     await Mensagem.create({
    //         phone:from,
    //         message:message,
    //     });
    //     console.log(`Mensagem recebida de ${from}: ${message}`);
    // }
    // //resposta para o webhook
    // res.sendStatus(200);