// Criando nova tabela com Sequelize
const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("pergunta", {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;