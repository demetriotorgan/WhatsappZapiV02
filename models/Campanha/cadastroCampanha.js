const mongoose = require('mongoose');

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
    metas:Array
});
CadastroCampanhaSchema.pre('save', function(next){
    if(!this.id_campanha){
        this.id_campanha = this._id.toString();
    }
    next();
});
module.exports = mongoose.model('CadastroCampanha', CadastroCampanhaSchema);