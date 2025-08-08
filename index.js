const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes/Routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//Conexão com o mongoDB Atlas
mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>console.log(`Conectado ao MongoDB`))
    .catch((err)=>console.log(err))

//Rotas
app.use('/', routes);

app.listen(PORT, ()=>console.log(`Rodando na porta ${PORT}`));

//Requisição
//URL -> http://localhost:5000/enviar
//JSON:
// {
//   "phone":"5544998994890",
//   "message":"Oi amor!!! "
// }
//Headers: Content-Type application/json