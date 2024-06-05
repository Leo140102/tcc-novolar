const express = require('express');
const app = express();
const port = 3000;
const mysql = require("mysql")

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "220709tccnovoLar",
    database: "mydb",
});

app.get("/",(req, res)=>{
    console.log("Testandando rota insert")
    db.query("INSERT INTO mydb.locador (cpf, telefone, nome, dtNascimento, idImovelAtual, idImovelAnterior, email, senha,imovel_id) VALUES ('09560828908', '(44)99886466', 'Bruno Xavier', '22/07/1998', 'NULL','NULL','brunoXavier@gmail.com','11223344',1)"),(err,result) =>{     
        if(err){
            console.log(err)
        }       
    }
})

app.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query("INSERT INTO mydb.locador (cpf, telefone, nome, dtNascimento, idImovelAtual, idImovelAnterior, email, senha, imovel_id) VALUES (?,?,?,?,?,?,?,?,?)", ['09560828908', '4499886466', 'Bruno Xavier', '1998-07-22', null, null, 'brunoXavier@gmail.com', '11223344', 1]);
        console.log(result);
        res.send('Dados inseridos com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao inserir dados.');
    } finally {
        // Fechar a conexão com o banco de dados
        await db.end();
    }
});

app.listen(3000, () =>{
    console.log("Rodando na porta 3000")
});
