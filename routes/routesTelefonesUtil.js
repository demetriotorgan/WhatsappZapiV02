const express = require('express');
const Telefones = require('../models/Telefones');

require('dotenv').config();

const router = express.Router();

//Salva telefone na lista
router.post('/telefones', async(req,res)=>{
    try {
       const { phone } = req.body;
       if (!phone) {
        return res.status(400).json({ erro: 'O campo phone é obrigatório' });   
       }

       //Verifica Duplicata
       const existente = await Telefones.findOne({phone});
       if(existente){
        return res.status(400).json({erro:'O telefone já existe na lista'});
       }

       //Criar um novo registro
       const novoTelefone = new Telefones({phone});
       await novoTelefone.save();
       res.json({sucesso: true, mensagem:'Telefone adicionado com sucesso'});
    } catch (err) {
        console.log(err);
        res.status(500).json({erro:'Erro ao salvar telefone'});
    }        
});

//Exibi Lista telefones completa
router.get('/listar-telefones', async(req,res)=>{
    try {
        const lista = await Telefones.find(); //busca todos os telefones
        res.json(lista);
    } catch (err) {
        console.error(err);
        res.status(500).json({erro:'Erro ao buscar lista de telefones'});
    }
});

//Deleta lista de telefones
router.delete('/telefones', (req, res)=>{
    salvarTelefones([]);
    res.json({sucesso:true, mensagem:'Lista de telefone limpa com sucesso'});
});

//Deleta um telefone da lista
router.delete('/telefones/:phone', (req, res)=>{
    const {phone} = req.params;
    if (!phone) {
        return res.status(400).json({ erro: 'Número de telefone é obrigatório' });
    }

    let lista = lerTelefones();
    const index = lista.findIndex(t => t.phone === phone);

    if (index === -1) {
        return res.status(404).json({ erro: 'Telefone não encontrado na lista' });
    }

    // Remove o telefone da lista
    lista.splice(index, 1);
    salvarTelefones(lista);

    res.json({ sucesso: true, mensagem: `Telefone ${phone} removido com sucesso` });
});


//Carrega lista de telefones completa
router.post('/telefones/lote', (req, res) => {
    const { telefones } = req.body;

    if (!Array.isArray(telefones) || telefones.length === 0) {
        return res.status(400).json({ erro: 'O campo "telefones" deve ser um array não vazio' });
    }

    let lista = lerTelefones();
    let adicionados = [];
    let duplicados = [];

    telefones.forEach(phone => {
        // Evita duplicatas
        if (!lista.find(t => t.phone === phone)) {
            lista.push({ phone, status: 'não-enviado' });
            adicionados.push(phone);
        } else {
            duplicados.push(phone);
        }
    });

    salvarTelefones(lista);

    res.json({
        sucesso: true,
        mensagem: 'Processamento concluído',
        adicionados,
        duplicados
    });
});

//Atualiza status
router.put('/telefones/status', (req,res)=>{
    const { phone, status } = req.body;
    if (!phone || !status) {
        return res.status(400).json({ erro: 'Campos phone e status são obrigatórios' });
    }

    let lista = lerTelefones();
    const index = lista.findIndex(t => t.phone === phone);

    if (index === -1) {
        return res.status(404).json({ erro: 'Telefone não encontrado' });
    }

    lista[index].status = status;
    salvarTelefones(lista);

    res.json({ sucesso: true, mensagem: 'Status atualizado com sucesso' });
});

module.exports = router;
