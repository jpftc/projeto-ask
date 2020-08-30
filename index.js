const express = require("express");
const app = express();
// Envia dados do form para o backend
const bodyParser = require("body-parser");
// Importa conexão com base de dados
const connection = require("./database/database");
// Executa a criação das tabelas ao importar modulos
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta")

// Autenticação com a database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// fazer o Express usar ejs como view engine
app.set("view engine", "ejs");
// Define diretório como de arquivos estaticos
app.use(express.static("public"));

// configuração do bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Criação de rotas
app.get("/", (req, res) => {
    // Consulta tabela de perguntas no MySql
    Pergunta.findAll({
        row: true, order: [
            ["id", "DESC"] // ordena consulta pelo campo "id", DESC = decrescente, ASC = crescente
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

// Capturando campos do form
app.post("/salvarpergunta", (req, res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        description: descricao
    }).then(() => {
        res.redirect("/");
    }).catch((err) => {
        console.log(err);
    });
});

app.get("/pergunta/:id", (req, res) => {
    // pega parametro da URL: app.get("/pergunta/:id")
    var id = req.params.id;
    // Consulta no banco com where
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            // Consulta das respostas
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ["id", "DESC"]
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        } else {
            res.redirect("/");
        }
    });
});

// insere resposta na tabela de resposta e redireciona o usuário pra pagina da pergunta respondida
app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

// Abrindo porta da aplicação
app.listen(3000, () => {
    console.log("App rodando!");
});