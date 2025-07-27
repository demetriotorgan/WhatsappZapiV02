const mongoose = require('mongoose');

const MensagemRecebidaSchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true,
    },
    senderName:{
        type:String,        
    },
    chatName:{
        type:String,
    },
    message:{
        type:String,
        required:true,
    },
    dataRecebida:{
        type:Date,
        default:Date.now,
    }
});

module.exports = mongoose.model('MensagemRecebida', MensagemRecebidaSchema);