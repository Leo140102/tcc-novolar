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
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Substitua pelo domínio do seu cliente
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

//Configurações da session
app.use(session({

    secret: 'rwZcr7FK',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

global.myGlobalVariable




//Middleware
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
// })

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

//----------------------------Login-------------------------------------

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const senha = req.body.senha;

        const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM mydb.locatario WHERE email =?", [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.length === 0) {
            return res.status(404).send('Conta não encontrada.');
        }

        const passwordMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(senha, result[0].senha, (erro, result) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(result);
                }
            });
        });

        if (!passwordMatch) {
            return res.status(401).send('Senha incorreta.');
        }

        myGlobalVariable = req.session.nome = result[0].nome
        return res.sendStatus(200);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
});

app.get("/user/name", (req, res) => {
    console.log("testeeeeeeeeeeeeeeeeeee");
    console.log(req.session); // Para depuração, verifique todo o objeto de sessão
    req.session.nome = myGlobalVariable
    console.log(req.session.nome); // Verifica o valor de nome na sessão

    

    if (req.session.nome) {
        res.json({ nome: req.session.nome }); // Retorna apenas o nome
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' }); // Mensagem de erro se o nome não for encontrado
    }
});

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