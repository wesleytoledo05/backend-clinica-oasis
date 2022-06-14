
const mysql = require('mysql');

//faz a conexao com o banco de dados
const mysqConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

mysqConnection.connect();

module.exports = mysqConnection;