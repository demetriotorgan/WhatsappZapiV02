const express = require('express');
const axios = require('axios');

require('dotenv').config();

const router = express.Router();

//----------Imagem e Contato---------
router.post('/enviar-imagem-contato', async(req,res)=>{
    try {
        const {phone, image, caption, viewOnce, contactName, contactPhone} = req.body;

        // 1- Envia imagem
        const imageResponse = await axios.post(
            `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-image`,
            {
             phone,
             image,
             caption,
             viewOnce      
            },
            {
                 headers: { 'Client-Token': process.env.ZAPI_CLIENT_TOKEN }                 
            }
        );

        // 2- Envia Contato
        const contactResponse = await axios.post(
            `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-contact`,
            {
                phone, 
                contactName,
                contactPhone
            },
            {
                 headers: { 'Client-Token': process.env.ZAPI_CLIENT_TOKEN }
            }
        );
        res.json({
            success:true,
            imageResponse: imageResponse.data,
            contactResponse: contactResponse.data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;