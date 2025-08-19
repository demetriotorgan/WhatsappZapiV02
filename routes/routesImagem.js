const express = require('express');
const axios = require('axios');
const Imagem = require('../models/Imagem');

require('dotenv').config();

const router = express.Router();

//Rota pra enviar imagem
router.post('/enviar-imagem', async(req,res)=>{
    const {phone, image, caption, viewOnce} = req.body;
    if(!phone || !image || !caption || viewOnce === undefined){
        return res.status(400).json({erro:'Preencha todos os campos da requisição'})
    }
    if (typeof viewOnce !== 'boolean') {
      return res.status(400).json({ erro: 'O campo viewOnce deve ser um booleano' });
    }

    try {
        const response = await axios.post(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-image`,{
            phone:phone, 
            image:image,
            caption:caption,
            viewOnce:viewOnce
        },{
            headers:{
                         'Client-Token': process.env.ZAPI_CLIENT_TOKEN
                    }
        });
        console.log('Respota da Z-API:', response.data);
        //Salvando dados de envio no banco de dados
        await Imagem.create({phone, image, caption, viewOnce});
        res.status(200).json({sucesso:true, message:'Mensagem enviada com sucesso'});
    } catch (error) {
        if(error.response){
            console.error('Erro da Z-API:', error.response.data);
        }else{
            console.error('Erro desconhecido:', error.message);
        }        
        res.status(500).json({sucesso:false, error:'Erro ao enviar mensagem'});
    }
});



module.exports = router;