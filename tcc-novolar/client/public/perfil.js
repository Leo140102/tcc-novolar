window.onload = () => {
    // get_ImoveisDoUser();
}

const excluir = document.querySelector("#excluirUser");

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


//IMOVEIS USUARIO
function get_ImoveisDoUser(id) {
    fetch('http://localhost:8000/user/id')
        .then(response => response.json())
        .then(data => {
            var idUser = data.myGlobalVariableId;
            console.log("idLocatario ->" + idUser)
            ImoveisUsuario(idUser);
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));
}

function ImoveisUsuario(idUser) {
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
                document.querySelector("#no_imoveis").classList.remove("d-none")
            } else {
                document.querySelector("#anuncios").innerHTML = null;

                imoveis.forEach(imovel => {
                    let html = `           
                                    <a href="imovelItem.html?id=${imovel.id}">
                                        <img src="imagens/${imovel.image_url}" alt="Foto do imóvel">
                                    </a>

                                    <div class="detalhes">
                                        <h3>${imovel.titulo}</h3>
                                        <h6>R$ ${imovel.valor}</h6>
                                        <p>${imovel.endereco}</p>
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

