// app.patch('/alterPasswordLocatario/:id', async (req, res) => {
//     const { id } = req.params;
//     const { senhaAtual, novaSenha } = req.body;
//     const email = req.body.email;
//     let table = "";

//     try {
//         db.query("SELECT * FROM mydb.locador WHERE id = ? AND email = ?", [id, email], (err, locadorResult) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send({ error: 'Erro ao verificar o locador.' });
//             } else if (locadorResult.length > 0) {
//                 table = "mydb.locador";
//             }
        
//             // Verificando se o usuário existe na tabela 'locatario'
//             db.query("SELECT * FROM mydb.locatario WHERE id = ? AND email = ?", [id, email], (err, locatarioResult) => {
//                 if (err) {
//                     console.log(err);
//                     return res.status(500).send({ error: 'Erro ao verificar o locatario.' });
//                 } else if (locatarioResult.length > 0) {
//                     table = "mydb.locatario";
//                 }
        
//                 if (table === "") {
//                     return res.status(404).send({ error: 'Usuário não encontrado nas tabelas locador ou locatario.' });
//                 }
        
//                 const updateQuery = `UPDATE ${table} SET senha = ? WHERE id = ?`;
//                 await db.query(updateQuery, [hashedNovaSenha, id]);
//                 res.send({ message: 'Senha atualizada com sucesso!' });
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Erro interno do servidor' });
//     }
// });

// //-------------------------------------------------------------------------------------------
// db.query("SELECT * FROM mydb.locador WHERE id = ? AND email = ?", [id, email], (err, locadorResult) => {
//     if (err) {
//         console.log(err);
//         return res.status(500).send({ error: 'Erro ao verificar o locador.' });
//     } else if (locadorResult.length > 0) {
//         table = "mydb.locador";
//     }

//     // Verificando se o usuário existe na tabela 'locatario'
//     db.query("SELECT * FROM mydb.locatario WHERE id = ? AND email = ?", [id, email], (err, locatarioResult) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send({ error: 'Erro ao verificar o locatario.' });
//         } else if (locatarioResult.length > 0) {
//             table = "mydb.locatario";
//         }

//         if (table === "") {
//             return res.status(404).send({ error: 'Usuário não encontrado nas tabelas locador ou locatario.' });
//         }

//         const updateQuery = `UPDATE ${table} SET senha = ? WHERE id = ?`;
//         await db.query(updateQuery, [hashedNovaSenha, id]);
//         res.send({ message: 'Senha atualizada com sucesso!' });
//     });
// });