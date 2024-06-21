const express = require('express');
const app = express()
const PORT = 8000;
const mysql = require("mysql");
const bcrypt = require("bcrypt")
const cors = require("cors")
const saltRounds = 10
const bodyParser = require("body-parser")
const session = require("express-session")

const http = require('http')
const path = require('path')

const fs = require("fs")


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "220709tccnovoLar",
    database: "mydb",
});


app.use(express.json());
app.use(cors());

// app.use(bodyParser.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true
// }))

function redirectToIndex() {
    window.location.href = 'client/public/index.html';
}

app.post("/register", (req, res) => {
    
    const nome = req.body.nome
    const email = req.body.email
    const cpf = req.body.cpf
    const senha = req.body.senha

    db.query("SELECT * FROM mydb.locatario WHERE email =?",
        [email],
        (err, result) => {
            if (err) {
                res.send(err)
            }
            console.log(result.length)
            if (result.length === 0) {
                bcrypt.hash(senha, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO mydb.locatario (email, senha, cpf, nome) VALUES (?,?,?,?)",
                        [email, hash, cpf, nome], (err, response) => {
                            if (err) {
                                return  res.send(err)
                            }
                            redirectToIndex();
                            return  res.send({ msg: "Cadastrado com Sucesso" })
                            
                        })
                })

            } else {
                //res.send({ msg: "Usuário já cadastrado!" })
                return  res.send({ msg: "Usuário já cadastrado!" })
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
                return req.send(err)
            }
            console.log(result)
            if (result.length > 0) {
                bcrypt.compare(senha, result[0].senha,
                    (erro, result) => {
                        if (result) {
                            console.log("logado")
                            return res.send("Usuário logado com sucesso!")
                           
                        } else {
                            console.log("senha incorreta")
                            return res.send("Senha incorreta!")
                            
                        }
                    })

            } else {
                console.log("ENTRA ELSE");
                return res.send("Conta não encontrada!")
                
            }
        })
})

app.post('/login', async (req, res) => {
    console.log("INDEX.JS - Rota de Login");
    const { email, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM mydb.locatario WHERE email =?", [email]);
        if (user.length === 0) {
            return res.status(404).json({ msg: "Conta não encontrada!" });
        }

        // Comparação direta da senha, não recomendada por motivos de segurança
        if (password!== user[0].password) {
            return res.status(401).json({ msg: "Senha incorreta!" });
        }

        // Aqui você pode iniciar a sessão ou gerar um token JWT, dependendo da sua implementação
        req.session.loggedin = true;
        res.status(200).json({ msg: "Usuário logado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
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


app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`)

});

module.exports = app;