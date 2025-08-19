const mongoose = require('mongoose');

const telefonesSchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true,
        unique:true, //garante que não acha duplicatas
    },
    status:{
        type:String,
        enum:["nao-enviado", "enviado"],
        default:"nao-enviado",        
    },
});

module.exports = mongoose.model('Telefones', telefonesSchema);