window.onload = () => {
    get_ImoveisDoUser();
}

const excluir = document.querySelector("#excluirUser");

excluir.addEventListener("click", () => {
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
    fetch(`http://localhost:8000/deletar/${idUser}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('nok')
            }
        })
        .then(dados => {
            if (dados.length === 0) {
                console.log('erro!')
            } else {

            }

        })
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

