const mongoose = require('mongoose');

const ImpulsionamentoSchema = new mongoose.Schema({
    data:Date,
    urlImagem:String,
    mensagemEnviada: String,
    contato:String,
    telefoneContato:String,
    enviados:Number,
    tempoEnvio:String,
    metaSelecionada:String
});

const CadastroCampanhaSchema = new mongoose.Schema({
    nomeCliente:String,
    empresa:String,
    cidade:String,
    telefone:String,
    dataInicio:Date,
    duracao:Number,
    ramo:String,
    nomeCampanha:String,
    id_campanha:String,
    categoria:String,
    objetivos:Array,
    metas:Array,
    Impulsionamento:[ImpulsionamentoSchema]
});

CadastroCampanhaSchema.pre('save', function(next){
    if(!this.id_campanha){
        this.id_campanha = this._id.toString();
    }
    next();
});
module.exports = mongoose.model('CadastroCampanha', CadastroCampanhaSchema);