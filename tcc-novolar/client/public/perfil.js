window.onload = () => {
    get_ImoveisDoUser();
    set_DadosDoUser();
}

const excluir = document.querySelector("#excluirUser");

const atualizar = document.querySelector('#alterarUser')

excluir.addEventListener("click", () => {
    console.log("entrouclick");
    fetch('http://localhost:8000/user/id')
        .then(response => response.json())
        .then(data => {
            var idUser = data.myGlobalVariableId;
            console.log("idLocatario ->" + idUser)
            excluirUser(idUser)
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));
});

atualizar.addEventListener("click", () => {
    console.log("entrouclick");
    fetch('http://localhost:8000/user/id')
        .then(response => response.json())
        .then(data => {
            var idUser = data.myGlobalVariableId;
            atualizarUser(idUser)
            atualizarPassword(idUser)
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));
})

function atualizarUser(idUser) {
    const telefone = document.getElementById('telefone').value.toString().trim();
    const email = document.getElementById('emailLogado').value.toString().trim();

    const formCad = {
        telefone,
        email
    };

    const jsonData = JSON.stringify(formCad);
    console.log(jsonData);

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    };
    fetch(`http://localhost:8000/updateUserPhone/${idUser}`, options)
        .then(response => {
            if (response.status === 201) {
                redirectToLogin();
            } else if (response.status === 409) {
                callAlert('Falha ao atualizar usuário.');
            }
        })
        .then(data => console.log(data))
        .catch(error => console.error('Erro:', error));
}

function atualizarPassword(idUser) {
    const senhaAtual = document.getElementById('senhaAtual').value.toString().trim();
    const novaSenha = document.getElementById('senhaNova').value.toString().trim();
    const senhaNovaRepet = document.getElementById('senhaNovaRepet').value.toString().trim();
    const email = document.getElementById('emailLogado').value.toString().trim();

    if (senhaAtual === "" || novaSenha === "" || senhaNovaRepet === "") {
        return
    } else {
        if (novaSenha != senhaNovaRepet) {
            console.log('Confirmação de senha não correspondente');
            return;
        }

        fetch(`http://localhost:8000/tipoUser/${idUser}?email=${email}`)
            .then(response => response.json())
            .then(data => {
                if (data.tipoUsuario === "1") {

                    console.log("ENTROU LOCADOR ")

                    const formCad = {
                        senhaAtual,
                        novaSenha,
                    };
                    const jsonData = JSON.stringify(formCad);
                    console.log(jsonData);

                    const options = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: jsonData
                    };
                    fetch(`http://localhost:8000/alterPasswordLocatario/${idUser}`, options)
                        .then(response => {
                            if (response.status === 201) {
                                redirectToLogin();
                            } else if (response.status === 409) {
                                callAlert('Falha ao atualizar usuário.');
                            }
                        })
                        .catch(error => console.error('Erro:', error));
                } else {
                    console.log("ENTROU LOCATARIO ")

                    const formCad = {
                        senhaAtual,
                        novaSenha,
                    };
                    const jsonData = JSON.stringify(formCad);
                    console.log(jsonData);

                    const options = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: jsonData
                    };
                    fetch(`http://localhost:8000/alterPasswordLocador/${idUser}`, options)
                        .then(response => {
                            if (response.status === 201) {
                                redirectToLogin();
                            } else if (response.status === 409) {
                                callAlert('Falha ao atualizar usuário.');
                            }
                        })
                        .catch(error => console.error('Erro:', error));
                }
            })
            .catch(error => console.error('Erro ao verificar o tipo de usuário:', error));
    }
}


function excluirUser(idUser) {
    fetch(`http://localhost:8000/deletar/${idUser}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(dados => {
            if (typeof dados !== 'object' || dados === null || !Array.isArray(dados)) {
                console.error('Dados não são um array:', dados);
                return;
            }
            if (dados.length === 0) {
                console.log('Erro na exclusão!');
            } else {
                res.redirect("index.html");
                console.log('Usuário excluído com sucesso');

            }
        })
        .catch(error => {
            console.error('Erro ao deletar usuário:', error);
        });
}

//IMOVEIS EXCLUIR IMOVEL
function excluirImovel(idImovel) {
    console.log("excluirImovel");
    fetch(`http://localhost:8000/deletarImovel/${idImovel}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(dados => {
            if (typeof dados !== 'object' || dados === null || !Array.isArray(dados)) {
                console.error('Dados não são um array:', dados);
                return;
            }
            if (dados.length === 0) {
                console.log('Erro na exclusão!');
            } else {
                res.redirect("perfil.html");
                console.log('Imovel excluído com sucesso');

            }
        })
        .catch(error => {
            console.log(idImovel);
            console.error('Erro ao deletar Imovel:', error);
        });
}


//IMOVEIS USUARIO
function get_ImoveisDoUser() {
    fetch('http://localhost:8000/user/id')
        .then(response => response.json())
        .then(data => {
            var idUser = data.myGlobalVariableId;
            ImoveisUsuario(idUser);
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));
}

function ImoveisUsuario(idUser) {
    console.log(idUser);
    fetch(`http://localhost:8000/imoveisUser/${idUser}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('erro')
            }
        })
        .then(imoveis => {
            if (imoveis.length === 0) {
                console.log("SEM IMOVEIS");
                var donoSemImoveis = document.querySelector('.donoSemImoveis');
                var donoComImoveis = document.querySelector('.anuncio');
                donoSemImoveis.style.display = 'block';
                donoComImoveis.style.display = 'none';
            } else {
                document.querySelector("#account-imoveis").innerHTML = null;

                imoveis.forEach(imovel => {
                    let html = `           
                                    <a href="imovelItem.html?id=${imovel.id}">
                                        <img src="imagens/${imovel.image_url}" alt="Foto do imóvel">
                                    </a>

                                    <div class="detalhes">
                                        <h3>${imovel.titulo}</h3>
                                        <h6>R$ ${imovel.valor}</h6>
                                        <p>${imovel.endereco}</p>

                                        <div id="excluirImovel" style="color: rgb(26, 16, 117);" onclick="excluirImovel(${imovel.id})">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </div>

                                        <div class="ativarAnuncio">
                                            <input type="checkbox" id="ativarAnuncioCheckbox" data-id="${imovel.id}" ${imovel.ativar == 1 ? 'checked' : ''}>
                                            <label for="ativarAnuncioCheckbox">Ativar anúncio</label>
                                        </div>
                                    </div>`;

                    let new_anuncio = document.createElement('div');
                    new_anuncio.classList.add('anuncio')
                    new_anuncio.innerHTML = html;

                    document.querySelector("#account-imoveis").appendChild(new_anuncio);

                });
                //document.querySelector("#no_imoveis").classList.add("d-none");
            }

        })
}

document.getElementById('salvarAlteracoes').addEventListener('click', function () {

    var checkboxes = document.querySelectorAll('.ativarAnuncio input[type="checkbox"]');
    var idsImoveis = [];
    var valores = [];

    checkboxes.forEach(function (checkbox) {
        var idImovel = checkbox.getAttribute('data-id');
        idsImoveis.push(idImovel);
        if (checkbox.checked) {
            valores.push(1);
        } else {
            valores.push(0);
        }
    });

    console.log(idsImoveis + "AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(valores + "BBBBBBBBBBBBBBBBBB");
});

function set_DadosDoUser() {
    fetch('http://localhost:8000/user/id')
        .then(response => response.json())
        .then(data => {
            var idUser = data.myGlobalVariableId;
            setaDadosUsuario(idUser);
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));
}

function setaDadosUsuario(idUser) {
    console.log(idUser + "setaDadosUsuario");
    fetch(`http://localhost:8000/tipoUserID/${idUser}`)
        .then(response => response.json())
        .then(data => {
            if (data.tipoUsuario === "1") {

                fetch(`http://localhost:8000/dadosUserLocador/${idUser}`)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            console.log('Erro ao buscar dados do usuário');
                            throw new Error('Erro ao buscar dados do usuário'); // Lança um erro para tratar na próxima etapa
                        }
                    })
                    .then(data => { // 'data' é o array de usuários
                        const usuario = data[0]; // Pega o primeiro objeto do array
                        // Agora 'usuario' deve conter os dados do usuário
                        console.log(usuario.email);
                        document.getElementById('nomeLogado').value = usuario.nome || '';
                        document.getElementById('cpfLogado').value = usuario.cpf || '';
                        document.getElementById('telefone').value = usuario.telefone || '';
                        document.getElementById('emailLogado').value = usuario.email || '';
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            } else {
                fetch(`http://localhost:8000/dadosUser/${idUser}`)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            console.log('Erro ao buscar dados do usuário');
                            throw new Error('Erro ao buscar dados do usuário'); // Lança um erro para tratar na próxima etapa
                        }
                    })
                    .then(data => { // 'data' é o array de usuários
                        const usuario = data[0]; // Pega o primeiro objeto do array
                        // Agora 'usuario' deve conter os dados do usuário
                        console.log(usuario.email);
                        document.getElementById('nomeLogado').value = usuario.nome || '';
                        document.getElementById('cpfLogado').value = usuario.cpf || '';
                        document.getElementById('telefone').value = usuario.telefone || '';
                        document.getElementById('emailLogado').value = usuario.email || '';
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            }
        })
        .catch(error => console.error('Erro ao verificar o tipo de usuário:', error));

}