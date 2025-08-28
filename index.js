const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const routesMensagem = require('./routes/routesMensagem');
const routesImagemContato = require('./routes/routesImagemContato');
const routesImagem = require('./routes/routesImagem');
const routesWebHook = require('./routes/routesWebHooks');
const routesWebHookStatus = require('./routes/routesWebHooksStatus');
const routesTelefonesUtil = require('./routes/routesTelefonesUtil');
const routesCadastrarCampanha = require('./routes/Campanha/routesCadastrarCampanha');

const app = express();
app.use(cors({
    origin:'*',
}));
app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    next();    
  });

const PORT = process.env.PORT || 5000;

app.use(express.json());

//Conexão com o mongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>console.log(`Conectado ao MongoDB`))
    .catch((err)=>console.log(err))

//Rotas
app.use('/', routesMensagem);
app.use('/', routesImagem);
app.use('/', routesImagemContato);
app.use('/', routesWebHook);
app.use('/', routesWebHookStatus);
app.use('/', routesTelefonesUtil);
app.use('/',routesCadastrarCampanha)


app.listen(PORT, ()=>console.log(`Rodando na porta ${PORT}`));