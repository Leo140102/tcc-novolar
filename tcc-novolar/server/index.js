const express = require('express');
const app = express();
const port = 3000;
const mysql = require("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "220709tccnovoLar",
    database: "mydb",
});


app.use(express.json());
app.use(cors());

app.post("/register", (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    db.query("SELECT * FROM mydb.locador WHERE EMAIL = ?",
    [email],
        (err,result) =>{
            if(err){
                res.send(err)
            }
            if(result.lenght == 0){
                db.query("INSERT INTO mydb.locatario (email, password) VALUES (?,?)", 
                [email,password],(err, result) =>{
                    if(err){
                        res.send(err)
                    }
                    res.send({msg: "Cadastrado com Sucesso"})
                })
            }
            res.send(result)
        }
    )
})

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

app.listen(3000, () =>{
    console.log("Rodando na porta 3000")
});
