const mongoose = require ('mongoose');

const ListaTelefoneJSONSchema = new mongoose.Schema({
    nome:String,
    telefones:Array
});

module.exports = mongoose.model('ListaTelefones', ListaTelefoneJSONSchema );