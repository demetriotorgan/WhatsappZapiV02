const express = require('express');
const axios = require('axios');
const CadastroCampanha = require('../../models/Campanha/cadastroCampanha');

const router = express.Router();

//Rota para cadastrar uma nova campanha
router.post('/cadastrar-campanha', async(req, res)=>{
    const {
    nomeCliente, 
    empresa, 
    cidade, 
    telefone, 
    dataInicio,
    duracao,
    ramo,
    nomeCampanha} = req.body;
    if(!nomeCliente || !empresa || !dataInicio || !duracao || !nomeCampanha){
        return res.status(400).json({erro:'Informações impletas'});
    }
    try {
        const NovaCampanha = new CadastroCampanha({
            nomeCliente,
            empresa,
            cidade,
            telefone,
            dataInicio,
            duracao,
            ramo,
            nomeCampanha
        });
        await NovaCampanha.save();
        res.status(201).json({mensagem:'Campanha cadastrada com sucesso'});
    } catch (error) {
        console.error(error);
        res.status(500).json({erro:'Erro ao cadastrar usuario favor tente novamente'});
    }   
});

router.get('/campanhas', async(req, res)=>{
    try {
        const campanhas = await CadastroCampanha.find();
        res.json(campanhas);
    } catch (error) {
        console.error(error);
        res.status(500).json({mensage:'Erro ao listar campanhas salvas'})
    }
});

router.delete('/deletar-campanhas', async(req,res)=>{
try {
    await CadastroCampanha.deleteMany({});
    res.status(200).json({mensagem:'Campanhas deletadas com sucesso'});
} catch (err) {
    console.error(err);
    res.status(500).json({mensagem:'Erro ao deletar lista de campanhas'});
}
});


router.put('/atualizar-campanha/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const dadosAtualizados = req.body;

        const campanhaAtualizada = await CadastroCampanha.findOneAndUpdate(
            {id_campanha: id},
            {$set: dadosAtualizados},
            {new:true}
        );
        if(!campanhaAtualizada){
            return res.status(400).json({message:'Campanha não encontrada'})
        }
        res.status(200).json({
            message:'Campanha atualizada com sucesso',
            campanha:campanhaAtualizada
        });
    } catch (error) {
        res.status(500).json({
            message:'Erro ao atualizar campanha',
            erro:error.message,
        });
    }
});

router.post('/atualizar-meta/:id', async(req,res)=>{
try {
    const {id} = req.params;

    const novoImpulsionamento = {
        data: req.body.data,
        urlImagem: req.body.urlImagem,
        mensagemEnviada: req.body.mensagemEnviada,
        contato:req.body.contato,
        telefoneContato:req.body.telefoneContato,
        enviados: req.body.enviados,
        tempoEnvio: req.body.tempoEnvio,
        metaSelecionada: req.body.metaSelecionada
     };

     const campanhaAtualizada = await CadastroCampanha.findOneAndUpdate(
        { id_campanha: id },
        { $push: { Impulsionamento: novoImpulsionamento } },
        { new: true } // retorna o documento atualizado
     );
     if (!campanhaAtualizada) {
      return res.status(404).json({ message: 'Campanha não encontrada' });
    }

    // Pega o último impulsionamento (o que acabou de ser adicionado)
    const impulsionamentoAdicionado = campanhaAtualizada.Impulsionamento.slice(-1)[0];

    res.status(201).json({
      message: 'Impulsionamento adicionado com sucesso',
      impulsionamento: impulsionamentoAdicionado
    });

} catch (error) {
    console.error('Erro ao adicionar impulsionamento:', error);
    res.status(500).json({
      message: 'Erro ao salvar impulsionamento',
      erro: error.message
    });
    }
})

module.exports = router;