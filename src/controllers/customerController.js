const express = require("express");
const mysqConnection = require("../database");

const router = express.Router();

router.get('/', async (req, res) => {
  //Consulta as informações do cliente (nome, endereço, email etc)
  res.status(200).send({message: "Esta é a rota relacionada ao cliente"})
})

router.post('/infos', async (req, res) => {
//Consulta as informações do cliente (nome, endereço, email etc)

})


module.exports = app => app.use('/customer', router);