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

// Caminho da pasta public
const publicDir = path.join(process.cwd(), 'public');

// Cria a pasta public se não existir
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('📂 Pasta /public criada.');
}

// Caminho do arquivo único
const filePathTelefones = path.join(publicDir, 'telefones.json');

// Cria o arquivo se não existir
if (!fs.existsSync(filePathTelefones)) {
    fs.writeFileSync(filePathTelefones, JSON.stringify([], null, 2));
    console.log('📄 Arquivo telefones.json criado.');
}
console.log('✅ Inicialização de arquivos concluída.');


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


app.listen(PORT, ()=>console.log(`Rodando na porta ${PORT}`));