const express = require('express');
const app = express()

const PORT = 8000;
const mysql = require("mysql");
const bcrypt = require("bcrypt")
const cors = require("cors")
const saltRounds = 10
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")

const path = require('path')

//Configurações do banco
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "220709tccnovoLar",
    database: "mydb",
});

app.use(express.json());
app.use(cors());
//Configurações da session
app.use(session({
    secret: 'rwZcr7FK', // Uma string secreta usada para assinar o cookie da sessão
    resave: true, // Força a sessão a ser salva, mesmo se modificada
    saveUninitialized: true, // Salva sessões não modificadas
    cookie: { secure: false } // Ativa o atributo Secure do cookie, recomendado para produção
}));
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
})

/* -------------------- cadastro ----------------*/

app.post("/register", (req, res) => {

    const nome = req.body.nome
    const email = req.body.email
    const cpf = req.body.cpf
    const senha = req.body.senha

    db.query("SELECT * FROM mydb.locatario WHERE email =?",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            console.log(result.length)
            if (result.length === 0) {
                bcrypt.hash(senha, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO mydb.locatario (email, senha, cpf, nome) VALUES (?,?,?,?)",
                        [email, hash, cpf, nome], (err, response) => {
                            if (err) {
                                return res.send(err)
                            }
                            return res.status(201).send('Usuário cadastrado com sucesso!')
                        })
                })

            } else {
                //res.send({ msg: "Usuário já cadastrado!" })
                return res.status(409).send('Usuário já cadastrado.');
            }
        }
    )
})

app.use(express.static(path.join(__dirname, 'public')))

app.use("/public/*", (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.redirect('/index.html')
    }
})


/* -------------------- login ----------------*/
app.post("/login", (req, res) => {
    const email = req.body.email
    const senha = req.body.senha
    db.query(
        "SELECT * FROM mydb.locatario WHERE email = ?", [email], (err, result) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            console.log(result)
            if (result.length > 0) {
                bcrypt.compare(senha, result[0].senha,
                    (erro, result) => {
                        if (result) {
                            req.session.user = {
                                nome: result[0].nome,
                                email: email
                            };
                            return res.status(200).send('Login realizado com sucesso.');

                        } else {
                            return res.status(401).send('Senha incorreta.');

                        }
                    })

            } else {
                return res.status(404).send('Conta não encontrada.');

            }
        })
})

/* -------------------- ROTAS ANUNCIOS IMOVEIS ----------------*/
/* TESTE */
app.get("/", (req, res) => {

    db.query("SELECT COUNT(*) imoveis FROM imovel", (err, results) => {
        if (err) {
            res.send("err.message");
        }
        res.send("ok");
    })
})

app.get("/imovel/:id", (req, res) => {

    db.query("SELECT * FROM imovel WHERE id= ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('err.message');
        }
        res.send(results);
    })
});
//imovel.html
app.get("/imoveis/:id", (req, res) => {

    db.query("WITH RankedImages AS (SELECT imovel.*,imagens.image_url, ROW_NUMBER() OVER(PARTITION BY imovel.id ORDER BY imagens.id ASC) AS RowNum FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id) SELECT * FROM RankedImages WHERE RowNum = 1;"
        , [req.params.id], (err, results) => {
            if (err) {
                res.send('err.message');

            }
            res.send(results);
        })
});

//imovelItem.html
app.get("/imovelItem/:id", (req, res) => {

    db.query("WITH RankedImages AS ( SELECT imovel.*, regras.idade, regras.sexo, regras.animais, regras.fumar, locador.telefone FROM mydb.imovel INNER JOIN mydb.regras ON imovel.id = regras.imoveis_id_regras LEFT JOIN mydb.locador ON imovel.id = locador.imovel_id ) SELECT * FROM RankedImages WHERE id = ?;"
        , [req.params.id], (err, results) => {
            if (err) {
                res.send('err.message');

            }
            res.send(results);
        })
});

//imovelItem.html IMAGENS
app.get("/imovelImgs/:id", (req, res) => {

    db.query("WITH RankedImages AS ( SELECT imovel.id, imagens.image_url FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id ) SELECT * FROM RankedImages WHERE id = ? ;"
        , [req.params.id], (err, results) => {
            if (err) {
                res.send('err.message');

            }
            res.send(results);
        })
});

//index.html BEM AVALIADOS
app.get("/bemAvaliados", (req, res) => {

    db.query("WITH RankedImages AS ( SELECT imovel.*, imagens.image_url, ROW_NUMBER() OVER(PARTITION BY imovel.id ORDER BY imovel.nota DESC) AS RowNum FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id ORDER BY imovel.nota DESC ) SELECT * FROM RankedImages WHERE RowNum = 1 AND RowNum <= 4;", (err, results) => {
        if (err) {
            res.send("err.message");
        }
        res.send(results);
    })
})

/* IMOVEIS POR ID */
app.get("/imoveis/:id", (req, res) => {
    db.query("SELECT id, titulo FROM imovel WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('err.message');
        }
        res.json(results);
    })
});

app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`)

});

module.exports = app;