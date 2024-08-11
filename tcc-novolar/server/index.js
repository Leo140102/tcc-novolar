const express = require('express');
const app = express()
const fileupload = require('express-fileupload')

const multer = require('multer');

app.use(fileupload())

const PORT = 8000;
const mysql = require("mysql");
const bcrypt = require("bcrypt")
const cors = require("cors")
const saltRounds = 10
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")

const path = require('path')

// Configuração do Multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/upload/users');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + "_" + file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['image/png', 'image/jpg', 'image/jpeg'];
        const extension = file.mimetype.split('/')[1];
        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

app.use(upload.array("fotos"));

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
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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

global.myGlobalVariable = null
global.myGlobalVariableId = null





//Middleware
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
// })

/* -------------------- cadastro ----------------*/


app.post("/register", (req, res) => {

    console.log("register")

    const nome = req.body.nome
    const email = req.body.email
    const cpf = req.body.cpf
    const senha = req.body.senha
    const telefone = req.body.telefone
    const tipo = req.body.tipo

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
                        "INSERT INTO mydb.locatario (email, senha, cpf, nome, telefone,tipo) VALUES (?,?,?,?,?,?)",
                        [email, hash, cpf, nome, telefone, tipo], (err, response) => {
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

app.post("/registerLocador", (req, res) => {

    console.log("registerLocador")

    const nome = req.body.nome
    const email = req.body.email
    const cpf = req.body.cpf
    const senha = req.body.senha
    const telefone = req.body.telefone
    const tipo = req.body.tipo

    db.query("SELECT * FROM mydb.locador WHERE email =?",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            console.log(result.length)
            if (result.length === 0) {
                bcrypt.hash(senha, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO mydb.locador (email, senha, cpf, nome, telefone,tipo) VALUES (?,?,?,?,?,?)",
                        [email, hash, cpf, nome, telefone, tipo], (err, response) => {
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
            db.query("SELECT * FROM mydb.locatario WHERE email =?", [email], (err, resultQuery) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resultQuery);
                }
            });
        });
    

        console.log("RESULT --> " + result)
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
        myGlobalVariableId = req.session.id = result[0].id

        console.log("myGlobalVariableId ->" + myGlobalVariableId)
        return res.sendStatus(200);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
});


app.get("/user/id", (req, res) => {
    res.json({ myGlobalVariableId });
});

app.get("/user/name", (req, res) => {
    req.session.nome = myGlobalVariable
    if (req.session.nome) {
        res.json({ nome: req.session.nome });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    // req.flash('success_msg', "Deslogado com sucesso!");
    res.redirect("index.html");
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

    db.query("WITH RankedImages AS (SELECT imovel.* ,imagens.image_url, ROW_NUMBER() OVER(PARTITION BY imovel.id ORDER BY imagens.id ASC) AS RowNum FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id) SELECT * FROM RankedImages WHERE RowNum = 1;"
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

//index.html REPUBLICAS
app.get("/republicas", (req, res) => {

    db.query("WITH RankedImages AS ( SELECT imovel.*, imagens.image_url, ROW_NUMBER() OVER(PARTITION BY imovel.id ORDER BY imovel.nota DESC) AS RowNum FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id WHERE imovel.tipo = 'republica') SELECT * FROM RankedImages WHERE RowNum = 1 AND RowNum <= 4;", (err, results) => {
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

//--------------------------------ROTAS 2.0-------------------------------------

app.get('/pesquisa', (req, res) => {
    const { query } = req.query;

    let queryValue = '%' + query + '%';

    db.query('WITH RankedImages AS (SELECT imovel.*, imagens.image_url,ROW_NUMBER() OVER(PARTITION BY imovel.id ORDER BY imagens.id ASC) AS RowNum FROM mydb.imovel INNER JOIN mydb.imagens ON imovel.id = imagens.imovel_id WHERE imovel.titulo LIKE ?)SELECT * FROM RankedImages WHERE RowNum = 1;', [queryValue], (error, results) => {
        if (error) throw error;

        res.send(results);
    });
});

app.post("/registerLocador", (req, res) => {

    const nome = req.body.nome
    const email = req.body.email
    const cpf = req.body.cpf
    const senha = req.body.senha
    const telefone = req.body.telefone
    const dtNascimento = req.body.dtNascimento

    db.query("SELECT * FROM mydb.locador WHERE email =?",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).send({ error: err });
            }
            console.log(result.length)
            if (result.length === 0) {
                bcrypt.hash(senha, saltRounds, (erro, hash) => {
                    db.query(
                        "INSERT INTO mydb.locador (email, senha, cpf, nome,telefone,dtNascimento) VALUES (?,?,?,?,?,?)",
                        [email, hash, cpf, nome, telefone, dtNascimento], (err, response) => {
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

app.post("/registerImovel", (req, res) => {
    const tipo = req.body.tipo;
    const valor = req.body.valor;
    const area = req.body.area;
    const descricao = req.body.descricao;
    const locatario_id = req.body.locatario_id;
    const endereco = req.body.endereco;
    const titulo = req.body.titulo;

    const idade = req.body.idade;
    const sexo = req.body.sexo;
    const animais = req.body.animais;
    const fumar = req.body.fumar;

    try {
        db.query(
            "INSERT INTO mydb.imovel (tipo, valor, area, descricao, locatario_id, endereco, titulo) VALUES (?,?,?,?,?,?,?)",
            [tipo, valor, area, descricao, locatario_id, endereco, titulo],
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ error: 'Erro ao inserir imóvel.' });
                }

                const imovelId = result.insertId;

                db.query(
                    "INSERT INTO mydb.regras (idade, sexo, animais, fumar, imoveis_id_regras) VALUES (?, ?, ?, ?, ?)",
                    [idade, sexo, animais, fumar, imovelId],
                    (err, insertRegraResult) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send({ error: 'Erro ao inserir regra.' });

                        }

                        res.status(200).send('Cadastro realizado com sucesso.');
                    }
                );
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ocorreu um erro inesperado ao realizar o cadastro.' });
    }
});

// ----------------- ROTA ALTERAR INFOS USUARIO
// router.patch('/usuarios/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const { nome, cpf, telefone, email } = req.body;

//     await db.query(`UPDATE Usuarios SET nome='${nome}', cpf='${cpf}', telefone='${telefone}', email='${email}' WHERE id=${id}`);

//     res.sendStatus(200);
// });


//DELETAR CONTA
app.delete("/deletar/:id", (req, res) => {

    db.query("DELETE FROM locatario WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao excluir o usuário.');
        } else {
            res.status(200).send('Usuário excluído com sucesso.');
        }
    });

});

//DELETAR IMOVEL
app.delete("/deletarImovel/:id", (req, res) => {

    db.query("DELETE FROM imovel WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Erro ao excluir o imóvel.');
        } else {
            res.status(200).send('imóvel excluído com sucesso.');
        }
    });

});

//IMOVEIS POR USUARIO LOGADO
app.get("/imoveisUser/:id", (req, res) => {
    db.query("SELECT * FROM imovel WHERE locatario_id = ?;", [req.params.id], (err, results) => {
        if (err) {
            res.send('err.message');
        }
        res.json(results);
    })
});

app.patch("/updateUserPhone/:id", (req, res) => {
    const id = req.params.id;
    const telefone = req.body.telefone; // O novo número de telefone deve ser enviado no corpo da requisição
    const email = req.body.email;
    let table = "";
    try {
        // Verificando se o usuário existe na tabela 'locador'
        db.query("SELECT * FROM mydb.locador WHERE id = ? AND email = ?", [id, email], (err, locadorResult) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: 'Erro ao verificar o locador.' });
            } else if (locadorResult.length > 0) {
                table = "mydb.locador";
            }

            // Verificando se o usuário existe na tabela 'locatario'
            db.query("SELECT * FROM mydb.locatario WHERE id = ? AND email = ?", [id, email], (err, locatarioResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ error: 'Erro ao verificar o locatario.' });
                } else if (locatarioResult.length > 0) {
                    table = "mydb.locatario";
                }

                if (table === "") {
                    return res.status(404).send({ error: 'Usuário não encontrado nas tabelas locador ou locatario.' });
                }

                const updateQuery = `UPDATE ${table} SET telefone = ? WHERE id = ?`;
                db.query(updateQuery, [telefone, id], (err, updateResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ error: 'Erro ao atualizar o telefone.' });
                    }

                    if (updateResult.affectedRows === 0) {
                        return res.status(404).send({ error: 'Usuário não encontrado para atualização.' });
                    }

                    res.status(200).send('Telefone atualizado com sucesso.');
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Ocorreu um erro inesperado ao atualizar o telefone.' });
    }
});



module.exports = app;