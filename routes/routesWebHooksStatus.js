const express = require('express');
const axios = require('axios');
const StatusMensagemModel = require('../models/StatusMensagem');

require('dotenv').config();

const router = express.Router();

//---------Web Hook Status (CASA)
router.post('/instancia/:instancia/status', async(req,res)=>{
    try {
        const {instancia} = req.params;
        const {messageId, status, phone} = req.body;

        console.log(`Status recebido da instancia ${instancia}`);
        console.log(req.body);

        //Salvar no bando de dados
        const statusMensagem = await StatusMensagemModel.create({
            messageId,
            status,
            phone,
        });
        console.log('Status salvo com sucesso no MongoDB:', statusMensagem);
        res.status(200).json({success: true, message:'Status recebido com sucesso'});
    } catch (error) {
        console.error('Erro ao processar status: ', error);
        res.status(500).json({success:false, error:'Erro interno'});
    }
});

//Configurar webhook de Status
router.post('/configurar-webhook-status', async(req,res)=>{
    try {
        const {instancia, token} = req.body;

        //Minha Rota Publica;
        const urlDestino = `https://whatsapp-zapi-v01.vercel.app/instancia/${instancia}/status`;

        //Enviando para a Z-API
        const resposta = await axios.put(
            `https://api.z-api.io/instances/${instancia}/token/${token}/update-webhook-message-status`,
            {value: urlDestino},
            {headers:{
                "Content-Type": "application/json",
                 "Client-Token": process.env.ZAPI_CLIENT_TOKEN
                }
            }
        );
        res.status(200).json({
            success: true,
            message: "Webhook configurado com sucesso",
            resposta: resposta.data
        });
    } catch (error) {
        console.error("❌ Erro ao configurar webhook:", error.response?.data || error.message);
        res.status(500).json({success: false, error: "Erro ao configurar webhook"});
    }
});

//Receber lista de status salvos no BD
router.get('/status', async(req,res)=>{
    try {
        const statusMensagens = await StatusMensagemModel.find().exec();
        res.status(200).json(statusMensagens);
    } catch (error) {
        console.error('Erro ao buscar status: ', error);
        res.status(500).json({success:false, erro:'Erro interno'});
    }
});

//Apagar lista de status no BD
router.delete('/instancia/status', async(req,res)=>{
try {
    await StatusMensagemModel.deleteMany({});
    res.status(200).json({sucesso:true, message:'Registros apagados com sucesso'});
} catch (error) {
    console.error('Erro ao apagar registros',error);
    res.status(500).json({sucesso:false, erro:'Erro interno'});
}
});

module.exports = router;