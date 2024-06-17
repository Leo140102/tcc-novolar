const express = require('express');
const app = express()
const port = 8001;
const mysql = require("mysql");
const bcrypt = require("bcrypt")
const cors = require("cors")
const saltRounds = 10

const http = require('http')
const path = require('path')

const fs = require("fs")
var session = require = ("express-sesserio")


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "220709tccnovoLar",
    database: "mydb",
});


app.use(express.json());
app.use(cors());

app.use(express.urlencoded())
app.use(session({
    secret:"abc"
}))

// app.post("/register", (req, res) => {

//     const email = req.body.email
//     const password = req.body.password
//     const cpf = req.body.cpf
//     const nome = req.body.nome
//     const telefone = req.body.telefone
//     const dtNascimento = req.body.dtNascimento

//     db.query("SELECT * FROM mydb.locador WHERE EMAIL = ?",
//         [email],
//         (err, result) => {
//             if (err) {
//                 res.send(err)
//             }
//             if (result.lenght == 0) {
//                 bcrypt.hash(password, saltRounds, (erro, hash) => {
//                     db.query(
//                         "INSERT INTO mydb.locatario (email, senha, cpf, nome, telefone, dtNascimento) VALUES (?,?,?,?,?,?)",
//                         [email, hash, cpf, nome, telefone, dtNascimento], (err, response) => {
//                             if (err) {
//                                 res.send(err)
//                             }
//                             res.send({ msg: "Cadastrado com Sucesso" })
//                         })
//                 })

//             } else {
//                 res.send({ msg: "Usuário já cadastrado!" })
//             }
//         }
//     )
// })

app.use()

app.post("/login", (req, res) => {

    const email = req.body.email
    const password = req.body.password

    db.query(
        "SELECT * FROM mydb.locatario WHERE email = ?", [email], (err, result) => {
            if (err) {
                req.send(err)
            }
            if (result.lenght > 0) {
                bcrypt.compare(password, result[0].password,
                    (erro, result) => {
                        if (result) {
                            res.send({ msg: "Usuário logado com sucesso!" })
                        } else {
                            res.send({ msg: "Senha incorreta!" })
                        }
                    })

            } else {
                res.send({ msg: "Conta não encontrada!" })
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

// function getRegistroById(id, callback) {
//     let query = 'SELECT * FROM mydb.imovel';
//     db.query(query, [id], (error, results) => {
//       if (error) throw error;
//       callback(null, results[0]);
//     });
//   }

//   // Rota GET para obter um registro pelo ID
//   app.get('/obterImovel/:id', (req, res) => {
//     const id = req.params.id;
//     getRegistroById(id, (err, registro) => {
//       if (err) return res.status(500).send(err.message);
//       if (!registro) return res.status(404).send('Registro não encontrado.');
//       res.json(registro);
//     });
//   });



// app.get("/imovel/:id", (req, res) => {
//     //res.send("Olá Mundo!");
//     let id = req.params.id;
//     db.query("SELECT * FROM imovel WHERE id= ?", [req.params.id], (err, results) => {
//         if (err) {
//             res.send('err.message');
//             //res.send("Olá Mundo!");
//         }
//         res.json(results);
//     })
// });

/* IMOVEIS POR ID */
app.get("/imoveis/:id", (req, res) => {
    db.query("SELECT id, titulo FROM imovel WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('err.message');
        }
        res.json(results);
    })
});


// app.get("/",(req, res)=>{
//     console.log("Testandando rota insert")
//     db.query("INSERT INTO mydb.locador (cpf, telefone, nome, dtNascimento, idImovelAtual, idImovelAnterior, email, senha,imovel_id) VALUES ('09560828908', '(44)99886466', 'Bruno Xavier', '22/07/1998', 'NULL','NULL','brunoXavier@gmail.com','11223344',1)"),(err,result) =>{     
//         if(err){
//             console.log(err)
//         }       
//     }
// })

// app.get('/', async (req, res) => {
//     try {
//         const db = await connectDB();
//         const result = await db.query("INSERT INTO mydb.locador (cpf, telefone, nome, dtNascimento, idImovelAtual, idImovelAnterior, email, senha, imovel_id) VALUES (?,?,?,?,?,?,?,?,?)", ['09560828908', '4499886466', 'Bruno Xavier', '1998-07-22', null, null, 'brunoXavier@gmail.com', '11223344', 1]);
//         console.log(result);
//         res.send('Dados inseridos com sucesso!');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Erro ao inserir dados.');
//     } finally {
//         // Fechar a conexão com o banco de dados
//         await db.end();
//     }
// });


app.listen(8000, () => {
    console.log(`Rodando na porta 8000`)

});

module.exports = app;