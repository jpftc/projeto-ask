// Criando conexão com banco de dados
const Sequelize = require('sequelize');

const connection = new Sequelize("guiaperguntas","root","lhp130894", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection;