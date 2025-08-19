const express = require('express');
const axios = require('axios');
const Mensagem = require('../models/Mensagem');
const MensagemRecebida = require('../models/MensagemRecebida');

require('dotenv').config();

const router = express.Router();

//Rota de envio de mensagem
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
                // console.log('Status:', response.status);
                // console.log('---------------------------');
                // console.log('Headers:', response.headers);
                console.log('Data:', response.data);
                // console.log('Resposta completa', response);
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

//Ler todas as mensagens enviadas
router.get('/mensagens', async(req,res)=>{
    try {
        const mensagens = await Mensagem.find().sort({_id:-1});
        res.status(200).json(mensagens);
    } catch (err) {
        console.error('Erro ao carregar mensagens', err);
        res.status(500).json({sucesso:false, erro:'Erro ao buscar mensagens'})
    }
});

//Limpar Registro Schema Mensagens Recebidas
router.delete('/limpar-mensagens', async(req, res)=>{
    try {
        //Encontrar o ultimo registro adicionado
        const ultimaMensagem = await MensagemRecebida.findOne().sort({receivedAt: -1});

        if(!ultimaMensagem){
            return res.status(404).json({message: 'Nenhuma mensagem encontrada'});
        }

        //Excluindo todos os registros, execeto o ultimo
        await MensagemRecebida.deleteMany({_id: {$ne:ultimaMensagem._id}});
        res.json({message: 'Mensagens limpas com sucesso'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Erro ao limpar mensagens'});
    }
});

module.exports = router;