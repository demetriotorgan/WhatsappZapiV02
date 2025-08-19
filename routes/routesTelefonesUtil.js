const express = require('express');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const router = express.Router();

//Funções Salvar e Ler Lista de Telefones e Status
const publicDir = path.join(process.cwd(), 'public');
const filePathTelefones = path.join(publicDir, 'telefones.json');

function lerTelefones(){
    return JSON.parse(fs.readFileSync(filePathTelefones, 'utf-8'));
}

function salvarTelefones(lista){
    fs.writeFileSync(filePathTelefones, JSON.stringify(lista, null,2));
}

//Salva telefone na lista
router.post('/telefones', (req,res)=>{
 const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ erro: 'O campo phone é obrigatório' });
    }

    let lista = lerTelefones();

    // Evita duplicatas
    if (lista.find(t => t.phone === phone)) {
        return res.status(400).json({ erro: 'Telefone já existe na lista' });
    }

    lista.push({ phone, status: 'não-enviado' });
    salvarTelefones(lista);

    res.json({ sucesso: true, mensagem: 'Telefone adicionado com sucesso' });
});

//Exibi Lista telefones completa
router.get('/listar-telefones', (req,res)=>{
    const lista = lerTelefones();
    res.json(lista);
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
